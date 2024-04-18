const dev = process.env['NODE_ENV'] === 'development';

const _url = (action, query = '') => {
	if (dev) {
		return `https://sdo.komus.net/komus_merch_shop/api/controller_dev.html?action=${ action }${
			query && '&' + query
		}`;
	}
	return `/komus_merch_shop/api/controller.html?action=${ action }${
		query && '&' + query
	}`;
};

export { _url };
