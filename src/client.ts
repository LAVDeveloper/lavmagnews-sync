import crypto from 'crypto'
import {Contact} from './magnews/interfaces'
import magnews from './magnews/magnews'


export const memberHash = (email : string) => {
  const hash = crypto.createHash('md5').update(email).digest('hex');
  return hash
}

export const addContact = async (member: Contact) => {
  const result = await magnews.addListMember(member)
  return result
}