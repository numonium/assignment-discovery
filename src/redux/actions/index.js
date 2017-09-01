import * as actionTypes from "./actionTypes";

import google from 'google-client-api';
import CFG from '../../cfg.json';

export const YT_API_KEY = CFG.API.youtube.key;
export const YT_CLIENT_ID = CFG.API.youtube.oauth.client_id;
export const YT_CLIENT_SECRET = CFG.API.youtube.oauth.client_secret;

export const yt_init = () => {

	return new Promise((resolve, reject) => {
	 
	    google()
	    	.then((gapi) => {
	    		gapi.client.setApiKey(YT_API_KEY);
	    		gapi.client.load('youtube','v3', resolve);

	    		window.gapi = gapi;

	    		return gapi;
	    	})

	    return google;
	});

};

export const yt_search = ({ q, maxResults=25, part="snippet", type="video", related=false, videoCategoryId=null }, dispatch) => {

	let actionType = actionTypes.YT_SEARCH_QUERIED;
	let actionType_recv = actionTypes.YT_SEARCH_RECEIVED_OK;

	if(videoCategoryId){
		actionType = actionTypes.YT_SEARCH_CATEGORY_QUERIED;
		// actionType_recv = actionTypes.YT_SEARCH_CATEGORY_RECEIVED_OK;
		actionType_recv = actionTypes.YT_SEARCH_RECEIVED_OK;
	}else if(related){
		actionType = actionTypes.YT_SEARCH_RELATED_QUERIED;
		actionType_recv = actionTypes.YT_SEARCH_RELATED_RECEIVED_OK;
	}

	let action = {
		type: actionType,
		maxResults,
		part,
		related,
		videoType: type,
		videoCategoryId
	};

	action[related ? 'relatedToVideoId' : 'q'] = q;

	dispatch(action);

	return new Promise((resolve, reject) => {

		google().then((gapi) => {

			gapi.client.setApiKey(YT_API_KEY);
			gapi.client.load('youtube','v3', () => { 
				console.log('yt[api][init]');

				let args = {
					part,
					type,
					maxResults,
					order: "viewCount",
					videoCategoryId
					// publishedAfter: "2015-01-01T00:00:00Z"
				};
				args[related ? 'relatedToVideoId' : 'q'] = (q ? encodeURIComponent(q).replace(/%20/g, "+") : '');

				var request = gapi.client.youtube.search.list(args);
				
				// execute the request
				request.execute(function(response) {

					dispatch({
						type: actionType_recv,
						results: response.result
					});

					return resolve(response.result);

				});
			});

		});

	});
};

export const yt_categories = ({ q, part="snippet", regionCode="US" }, dispatch) => {

	let action = {
		q,
		type: actionTypes.YT_CATEGORIES_QUERIED,
		part
	};

	dispatch(action);

	return new Promise((resolve, reject) => {

		google().then((gapi) => {

			gapi.client.setApiKey(YT_API_KEY);
			gapi.client.load('youtube','v3', () => { 
				console.log('yt[api][init]');

				let args = {
					part,
					regionCode,
				};
				args.q = encodeURIComponent(q || '').replace(/%20/g, "+");

				var request = gapi.client.youtube.videoCategories.list(args);
				
				// execute the request
				request.execute(function(response) {

					dispatch({
						type: actionTypes.YT_CATEGORIES_RECEIVED_OK,
						results: response.result
					});

					return resolve(response.result);

				});
			});

		});

	});
}
