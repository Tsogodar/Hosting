module.exports = {
    getDomain: () => {
        if (process.env.NODE_ENV === 'production') {
            return {
                name:'praca-dyplomowa.herokuapp.com',
                protocol:'https'
            };
        } else{
            return {
                name:'localhost:3000',
                protocol:'http'
            };
        }
    }
};