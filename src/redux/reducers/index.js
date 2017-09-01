import { combineReducers } from 'redux'
import * as actionTypes from "../actions/actionTypes";

export const featuredCategories = (state={}, action) => {

	if(action.type === actionTypes.YT_CATEGORIES_RECEIVED_OK){

		// alpha sort featured categories
		action.results.items.sort((a,b) => {

			if(!a.snippet || !a.snippet.title){
				return -1;
			}else if(!b.snippet || !b.snippet.title){
				return 1;
			}

			var str_a = a.snippet.title.toUpperCase();
			var str_b = b.snippet.title.toUpperCase();

			if(str_a < str_b){
				return -1;
			}else if(str_a > str_b){
				return 1;
			}

			return 0;

		});
		
		return Object.assign({},state,action.results);
	}

	return state || {};
};

export const videos = (state={}, action) => {

	if(action.type === actionTypes.YT_SEARCH_RECEIVED_OK){
		
		return Object.assign({},state,action.results);
	}

	return state || {};
};

export const videosCategory = (state={}, action) => {

	if(action.type === actionTypes.YT_SEARCH_CATEGORY_RECEIVED_OK){
		
		return Object.assign({},state,action.results);
	}

	return state || {};
};

export const videosRelated = (state={}, action) => {

	if(action.type === actionTypes.YT_SEARCH_RELATED_RECEIVED_OK){
		
		return Object.assign({},state,action.results);
	}

	return state || {};
};

export const rootReducer = combineReducers({
  videos,
  videosRelated,
  featuredCategories
});
