import crypto from 'crypto'
import magnews, {Contact} from './magnews'

export const makeClient = () => {
  if (process.env.AUTH_TOKEN) {
    const [tok, srv] = process.env.AUTH_TOKEN.split('-')

    if (!tok || !srv) throw Error('make sure token has both parts xxxxxxx-YYYY')

    magnews.setConfig({
      apiKey: tok,
      server: srv
    });
    return magnews
  }
  throw Error('Define AUTH_TOKEN')
}

export const memberHash = (email : string) => {
  const hash = crypto.createHash('md5').update(email).digest('hex');
  return hash
}

export const addContact = async (client : any,  member: Contact) => {
  const result = await client.addListMember(member)
  return result
}