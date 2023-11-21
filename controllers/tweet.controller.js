const Tweet = require("../database/models/tweet.model");
const { create, findAll, deleteById, findTweetById, findTweetAndUpdate } = require("../database/queries/tweet.queries");

/*        Controllers des Tweets                 */

exports.displayForm = (req, res) => {
    res.render('tweet/tweet-new')
}

exports.showTweets = async (req, res) => {
    const tweets = await findAll()
    res.render('tweet/tweet-list', {tweets});
}

exports.createNewTweet = async (req, res) => {
    try {
        const body = req.body
        await create(body)
        res.redirect('/')
    } catch (error) {
        const errors = Object.keys(error.errors).map(key => error.errors[key].message)
        res.status(400).render('tweet/tweet-new', {errors})
    }
}

exports.deleteTweet = async (req, res, next) => {
    try {
        const tweetId = req.params.tweetId;
        await deleteById(tweetId)
        res.end()
    } catch (error) {
        next(error)
    }
}

exports.editTweet = async (req, res, next) => {
    try {
        const tweetId = req.params.tweetId;
        const tweet = await findTweetById(tweetId);
        res.render('tweet/tweet-edit' , {tweet})
    } catch (error) {
        next(error)
    }
}

exports.updateTweet = async (req, res, next) => {
    const tweetId = req.params.tweetId;
    try {
        const body = req.body;
        await findTweetAndUpdate(tweetId, body)
        res.redirect('/')
    } catch (error) {
        const errors = Object.keys(error.errors).map(key => error.errors[key].message)
        const tweet = await findTweetById(tweetId)
        res.status(400).render('tweet/tweet-edit', { tweet, errors })
    }
}
