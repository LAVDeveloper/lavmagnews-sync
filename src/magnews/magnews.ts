import {Config, Contact, AddMemberResponse} from './interfaces'

class magnews {

    async addListMember(member: Contact) {

        fetch("https://apiserver/ws/rest/api/v19/contacts/merge",
        {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + 'token'
            },
            method: "POST",
            body: JSON.stringify(member)
        })
        .then(function(res){
            return res
        })
        .catch(function(res){ 
            return res
        })

    };

}

export default new magnews()
