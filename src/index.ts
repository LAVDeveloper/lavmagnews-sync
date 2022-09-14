import parseArg from 'minimist'
import {syncQueue, ActionMessageV2, EventMessageV2} from '@proca/queue'
import {KeyStore, loadKeyStoreFromFile} from '@proca/crypto'

import {
  ping,
  senders,
  makeClient,
  addContactToList
} from './client'

import {
  actionToContactRecord
} from './contact'


export const cli = async (argv : string[]) => {
  const opt = parseArg(argv)
  const client = makeClient()

  if (opt.h || opt.help) {
    console.log(`lavmagnews-sync [-psl]
-t test sign-in (ping API)
-s list senders
-e email - search member by email
-l get lists
-L break-down lists by language
-T audienceName audience name used as template for new lists
-A audienceName - just add all to that audience
-U upsert list (-c listname)
-D subcribe after DOI
-O opt out as transactional
-o only opt ins
-S skip campaigns
-P amqp prefetch count
-k keystore
    `)
  }

  if (opt.t) {
    console.log(await ping(client))
  }
  if (opt.s) {
    const r = await senders(client)
    console.log(r)
  }

  let keyStore : KeyStore | undefined;

  if (opt.k) {
    keyStore = loadKeyStoreFromFile(opt.k)
  }

  if (opt.q) {
    const url = opt.u || process.env.QUEUE_URL
    const skipCampaigns = opt.S ? opt.S.split(",") : []
    const listId = 'eci-proca'

    if (!url) throw Error(`Provide -u or set QUEUE_URL`)
    syncQueue(url, opt.q, async (action : ActionMessageV2 | EventMessageV2) => {
      if (action.schema === 'proca:action:2') {
        if (action.campaign.name in skipCampaigns) {
          console.info(`Not syncing action because ${action.campaign.name} is skipped`)
          return false;
        }

        const member = actionToContactRecord(action, Boolean(opt.D), Boolean(opt.O))
        const r = await addContactToList(client, listId, member, member.values)
        console.log(`added ${member.values.EMAIL} to list ${listId} (id ${listId})`)
        // console.log(r)
        return r
      }

    }, {keyStore , prefetch: opt.P || 10}).catch(e => console.error(e))
  }
}
/*
 *
 * */