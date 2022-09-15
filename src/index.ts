import parseArg from 'minimist'
import {syncQueue, ActionMessageV2, EventMessageV2} from '@proca/queue'
import {KeyStore, loadKeyStoreFromFile} from '@proca/crypto'

import {
  makeClient,
  addContact
} from './client'

import {
  actionToContactRecord
} from './contact'


export const cli = async (argv : string[]) => {
  const opt = parseArg(argv)
  const client = makeClient()

  let keyStore : KeyStore | undefined;

  if (opt.k) {
    keyStore = loadKeyStoreFromFile(opt.k)
  }

  if (opt.q) {
    const url = opt.u || process.env.QUEUE_URL
    const skipCampaigns = opt.S ? opt.S.split(",") : []
   
    if (!url) throw Error(`Provide -u or set QUEUE_URL`)
    syncQueue(url, opt.q, async (action : ActionMessageV2 | EventMessageV2) => {
      if (action.schema === 'proca:action:2') {
        if (action.campaign.name in skipCampaigns) {
          console.info(`Not syncing action because ${action.campaign.name} is skipped`)
          return false;
        }

        const member = actionToContactRecord(action, Boolean(opt.D), Boolean(opt.O))
        const r = await addContact(client, member)
        console.log(`added ${member.values.EMAIL} to MagNews list (id ${r.idcontact})`)
        // console.log(r)
        return r
      }

    }, {keyStore, prefetch: opt.P || 10}).catch(e => console.error(e))
  }
}
/*
 *
 * */