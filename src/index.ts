import parseArg from 'minimist'
import {syncQueue, ActionMessageV2, EventMessageV2} from '@proca/queue'
import {KeyStore, loadKeyStoreFromFile} from '@proca/crypto'

import {
  setClientToken,
  addContact
} from './client'

import {
  isActionSyncable,
  actionToContactRecord
} from './contact'

export const cli = async (argv : string[]) => {
  const opt = parseArg(argv)
  const clientToken = setClientToken()

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

        if (!isActionSyncable(action, opt.o)) {
          console.info(`Not syncing action id ${action.actionId} (no consent/opt in)`)
          return false
        }

        const member = actionToContactRecord(action, Boolean(opt.D), Boolean(opt.O))
        const r = await addContact(clientToken, member)
          console.log(`added ${member.values.EMAIL} to MagNews list`)
          return r
      }

    }, {keyStore, prefetch: opt.P || 10}).catch(e => console.error(e))
  }
}
/*
 *
 * */