const express = require('express');
const router = express.Router();
const Post = require('../models/Post');


router.get('', async(req, res) => {

    try {

        const locals = {
            title: "NodeJS Blog"
        };

        let perPage = 8;
        let page = req.query.page || 1;

        const data = await Post.aggregate(
            [
                {
                    $sort: {
                        createdAt: -1
                    }
                }
            ]
        ).skip(perPage * page - perPage)
        .limit(perPage)
        .exec();

        const count = await Post.countDocuments({});
        const nextPage = parseInt(page) + 1;
        const hasNextPage = nextPage <= Math.ceil(count/perPage);


        res.render(
            'index',
            {
                locals,
                data, 
                current: page,
                nextPage: hasNextPage ? nextPage : null,
                currentRoute: '/'
            }
        )
    } catch(error) {
        console.log(error);
    }
})

router.get('/about', (req, res) => {
    res.render('about');
})

router.get('/post/:id', async (req, res) => {
    try {
        
        let slug = req.params.id;
        const data = await Post.findById({ _id: slug});

        const locals = {
            title: data.title
        };

        res.render('post', { locals, data });

    } catch(error) {
        console.log(error);
    }
})

router.post('/search', async (req, res) => {
    try {
        let locals = {
            title: 'Search'
        }

        let searchTerm = req.body.searchTerm;

        const searchNoSpecialChar = searchTerm.replace(/[^a-zA-Z0-9 ]/g, "");

        const data = await Post.find(
            {
                $or: [
                    { title: { $regex: new RegExp(searchNoSpecialChar, 'i')}},
                    { body: { $regex: new RegExp(searchNoSpecialChar, 'i')}}
                ]
            }
        )


        if (data.length) {
            console.log("has something in it.")
        } else {
            console.log("doesn't have anything in it.")
        }

        res.render('search',{data, locals});

    } catch (error) {
        console.log(error);
    }
})

module.exports = router;