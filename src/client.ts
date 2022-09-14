import crypto from 'crypto'
import mailchimp from '@mailchimp/mailchimp_marketing'
import { Contact, ContactSubscription, ContactValues } from './contact'


export const makeClient = () => {
  if (process.env.AUTH_TOKEN) {
    const [tok, srv] = process.env.AUTH_TOKEN.split('-')

    if (!tok || !srv) throw Error('make sure token has both parts xxxxxxx-YYYY')

    mailchimp.setConfig({
      apiKey: tok,
      server: srv
    });
    return mailchimp
  }
  throw Error('Define AUTH_TOKEN')
}

export const ping = async (client : any) => {
  return await client.ping.get()
}

export const senders = async (client :  any) => {
  return await client.senders.list()
}

export const memberHash = (email : string) => {
  const hash = crypto.createHash('md5').update(email).digest('hex');
  return hash
}

export const addContactToList = async (client : any, list_id: string, member: Contact | ContactSubscription, memberValues : ContactValues) => {
  const hash = memberHash(memberValues.EMAIL.toLowerCase())
  const result = await client.lists.setListMember(list_id, hash, member, {skipMergeValidation: true})
  return result
}