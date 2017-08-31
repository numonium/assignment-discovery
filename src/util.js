export function getToken(token, wrap='###'){
  return wrap + token.toString().toUpperCase() + wrap;
}

export function getURL(index, tokens, api='flickr', wrap='###'){

  let API = window.API;

  if(!(index in API[api].url)){
    return false;
  }

  let url = API[api].url[index];

  for(var i in tokens){
    if(tokens.hasOwnProperty(i)){
      url = url.replace(getToken(i, wrap), encodeURIComponent(tokens[i]));
    }
  }

  return url;
}
