import type {ActionMessageV2, EventMessageV2} from '@proca/queue'

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

export interface ContactValues {
    EMAIL         : string;
    NAME          : string;
    SURNAME       : string;
    CELL?         : string;
    WBST_AUDIENCE : string;
    NOME_UTENTE   : string;
    UTM_SOURCE?   : string;
    UTM_MEDIUM?   : string;
    UTM_CAMPAIGN? : string;
    UTM_CONTENT?  : string;
}

export interface ContactOptions {
    iddatabase                        : number;
    sendemailonactions                : string;
    sendemail                         : boolean;
    usenewsletterastemplate           : boolean;
    idnewsletter                      : number;
    denyupdatecontact                 : boolean;
    forceallowrestorecontactonupdate  : boolean;
    denysubscribeunsubscribedcontact  : boolean;
}

export interface Contact {
    values : ContactValues,
    options : ContactOptions
}

export interface ContactSubscription {
  email_address: string;
  status:  'pending' | 'subscribed' | 'unsubscribed' | 'transactional' | 'cleaned';
  timestamp_opt?: string
}

export const actionToContactRecord = (action : ActionMessageV2, doubleOptIn : boolean, optOutAsTransactional : boolean) => {

  const cv : ContactValues = {
    EMAIL         : action.contact.email,
    NAME          : action.contact.firstName,
    SURNAME       : action.contact.lastName,
    CELL          : "",
    WBST_AUDIENCE : "ecipel",
    NOME_UTENTE   : action.contact.email + "_ecipel",
    UTM_SOURCE    : "",
    UTM_MEDIUM    : "",
    UTM_CAMPAIGN  : "",
    UTM_CONTENT   : ""
  }

  const co : ContactOptions = {
    iddatabase                        : 6,
    sendemailonactions                : "insert,restore",
    sendemail                         : true,
    usenewsletterastemplate           : true,
    idnewsletter                      : 1811,
    denyupdatecontact                 : true,
    forceallowrestorecontactonupdate  : true,
    denysubscribeunsubscribedcontact  : false
  }

  const r : Contact = {
    values: cv,
    options: co
  }

  return r
    
}