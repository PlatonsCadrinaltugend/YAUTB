exports.getData = async function getData(name){
    let query = `query SearchEmotes ($query: String!,$page: Int,$sort: Sort,$limit: Int,$filter: EmoteSearchFilter) {
        emotes(
            query: $query,
            page: $page,
            sort: $sort,
            limit: $limit,
            filter: $filter
          ){
            count
            items {
              id
              name
              state
              trending
              owner {
                id
                username
                display_name
                style {
                  color
                  paint_id
                  __typename
                }
                __typename
              }
              flags
              host {
                url
                files {
                  name
                  format
                  width
                  height
                  __typename
                }
                __typename
              }
              __typename
            }
            __typename
          }
        }`;
    let varr = {query: name, page:1, sort:{value: "popularity", order:"DESCENDING"}, limit:10, filter:{exact_match:false, case_sensitive:true, ignore_tags:true, zero_width:true,animated:true, aspect_ratio:""}};
    let datar = await fetch('https://7tv.io/v3/gql', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({operationName:'SearchEmotes', variables:varr, query:query}),
        }).then(data => data.json()).catch(error => console(error));
    if(datar.data.emotes){
        if(datar.data.emotes.items){
            let length = datar.data.emotes.items.length;
            if (length>100){
                length = 100;
            }
            for (var x=0; x<length;x++){
                elem = datar.data.emotes.items[x];
                if (elem.name == name){
                    return elem;
                }
            }
    }}

    return null;
}

exports.editEmoteSet = async function editEmoteSet(set, emoteid, name, action, Auth){
    let query = `mutation ChangeEmoteInSet($id: ObjectID!, $action: ListItemAction!, $emote_id: ObjectID!, $name: String) {
        emoteSet(id: $id) {
            id
            emotes(id: $emote_id, action: $action, name: $name) {
                id
                name
                __typename
                }
            __typename
        }
    }`;
    let varr = {id: set,action:action,emote_id:emoteid, name:name};
    let datar = await fetch('https://7tv.io/v3/gql', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json',
                    'authorization': `Bearer ${Auth}` },
        body: JSON.stringify({operationName:'ChangeEmoteInSet', variables:varr, query:query}),
        }).then(data => data.json()).catch(error => console(error));
    // console.log(datar);
    return null;
}

exports.getUsersByID = async function getUsersByID(){
    let query = `query UsersByID($list: [ObjectID!]!) {
        usersByID(list: $list) {
            id
            username
            display_name
            roles
            style {
                color
                __typename
            }
            avatar_url
            __typename
        }
    }`;
    let varr = {list:"KOK"};
    let datar = await fetch('https://7tv.io/v3/gql', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({operationName:'UsersByID', variables:varr, query:query}),
        }).then(data => data.json()).catch(error => console(error));
    return null;
}

exports.getEmotesByID = async function getEmotesByID(ID){
    let query = `query EmotesByID($list: [ObjectID!]!, $formats: [ImageFormat!]) {
        emotesByID(list: $list) {
            id
            name
            flags
            state
            tags
            owner {
                id
                display_name
                style {
                    color
                    __typename
                }
                __typename
            }
            host {
                url
                files(formats: $formats) {
                    name
                    format
                    width
                    height
                    size
                    __typename
                }
                __typename
            }
            __typename
        }
    }`;
    let varr = {list:ID, format:"2x.webp"};
    let datar = await fetch('https://7tv.io/v3/gql', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({operationName:'EmotesByID', variables:varr, query:query}),
        }).then(data => data.json()).catch(error => console(error));
    return datar;
}
exports.searchUsersByName = async function searchUsersByName(name){
    let query = `query SearchUsers($query: String!) {
        users(query: $query) {
            id
            username
            display_name
        }
    }`;
    let varr = {query:name};
    let datar = await fetch('https://7tv.io/v3/gql', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({operationName:'SearchUsers', variables:varr, query:query}),
        }).then(data => data.json()).catch(error => console(error));
    return datar.data.users[0].id;
}

exports.getEmoteSet = async function getEmoteSet(UserID){
    let data = await fetch(`https://7tv.io/v3/users/${UserID}`).then(data=>data.json());
    // console.log(data);
    if (data.connections){
        for (var elem of data.connections){
            if (elem.platform == "TWITCH"){
                return elem.emote_set.id;
            }
        }
    }
    return null;
}

exports.getAuth = async function getAuth(UserID){
    let data = await fetch(`https://7tv.io/v3/users/${UserID}`).then(data=>data.json());
    for (var elem of data.editors){
        if (elem.id == process.env.SEVENTVBOTID){
            return process.env.SEVENTVAUTH;
        }
    }
    // Using my personal Account to have access to more Channels
    // But only if the Bot has no rights
    for (var elem of data.editors){
        if (elem.id == process.env.SEVENTVUSERID){
            return process.env.SEVENTVAUTHUSER;
        }
    }
    return null;
}

exports.getEmoteInSet = async function getEmoteInSet(emotename, set){
    let data = await fetch(`https://7tv.io/v3/emote-sets/${set}?dummy=${Date.now()}`).then(data=>data.json());
    console.log(data.emotes);
    for (var elem of data.emotes){
        if (elem.name == emotename){
            return elem;
        }
    }
    return null;
}