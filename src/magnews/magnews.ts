import {Config, Contact, AddMemberResponse} from './interfaces'

class magnews {

    setConfig(config: Config) {
        return config
    };

    async addListMember(member: Contact) {

        fetch("https://apiserver/ws/rest/api/v19/contacts/merge",
        {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': 'Bearer 7285A-799D30FA0FFF8281BF569F464D900025567B42C4D20600E81CC7DBD7752CF19F06F334150C2D66526615F80B014779C3E05AA67620F6020DBBE2157EF71BD3AB42CA795EB571A8F654F1BECFE772AB33A74D4ECCFD6F629DAF27FCCCF99075D3BFC2426BB52C437E05003E7B401C0FDF9C6551F5AA2F3B44C4F1BE3D4C047F95'
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
