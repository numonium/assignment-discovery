import React from 'react';
import ReactDOM from 'react-dom';
import { shallow } from 'enzyme';
import SearchBox from './index';

it('renders SearchBox components', () => {

	const provider = 'flickr';

	const div = document.createElement('div');
	ReactDOM.render(<SearchBox provider={provider} />, div);
 
});
