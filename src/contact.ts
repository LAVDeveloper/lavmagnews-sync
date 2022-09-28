import type {ActionMessageV2, EventMessageV2} from '@proca/queue'
import {Contact, ContactValues, ContactOptions} from './magnews/interfaces'

export const listName = (action : ActionMessageV2, listPerLang : boolean) => {
  let c = action.campaign.name
  if (listPerLang)
    c = c + ` ${action.actionPage.locale}`
  if (action.privacy.optIn) {
    return `${c} (opt-in)`
  } else {
    return `${c} (opt-out)`
  }
}

export const isActionSyncable = (action : ActionMessageV2, onlyOptIn : boolean) => {
  return (action.privacy.withConsent) && (action.privacy.optIn || !onlyOptIn)
}

export const actionToContactRecord = (action : ActionMessageV2, doubleOptIn : boolean, optOutAsTransactional : boolean) => {

  const audience = 'ecipel'

  const cv : ContactValues = {
    EMAIL         : action.contact.email,
    NAME          : action.contact.firstName,
    SURNAME       : action.contact.lastName,
    CELL          : action.contact.phone,
    WBST_AUDIENCE : audience,
    NOME_UTENTE   : action.contact.email + "_" + audience,
    UTM_SOURCE    : action.tracking.source,
    UTM_MEDIUM    : action.tracking.medium,
    UTM_CAMPAIGN  : action.tracking.campaign,
    UTM_CONTENT   : action.tracking.content 
  }

  const co : ContactOptions = {
    iddatabase                        : 6,
    sendemailonactions                : "insert,restore,update",
    sendemail                         : false,
    usenewsletterastemplate           : true,
    idnewsletter                      : 1811,
    denyupdatecontact                 : false,
    forceallowrestorecontactonupdate  : true,
    denysubscribeunsubscribedcontact  : false
  }

  const r : Contact = {
    values: cv,
    options: co
  }

  return r
    
}