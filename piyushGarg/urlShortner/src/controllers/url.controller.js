import { URL } from "../models/url.models.js";
import { nanoid } from "nanoid";
import { asyncHandler } from "../utils/asyncHandler.js"
import { ApiError } from "../utils/ApiError.js";

const createShortUrl = asyncHandler(async (req, res) => {
    const body = req.body;
    console.log(body);
    if (!body.url) {
        throw new ApiError(400, "Please provide a url")
    }
    const shortID = nanoid(8);
    const url = await URL.create({
        shortId: shortID,
        redirectUrl: body.url,
        visitHistory: [],
        createdBy :req.user._id
    });

    // return res.render("home",{
    //     shortID
    // })
    res.redirect("/home");
    // res.status(200).json({message:"Short url created",shortID})
    

})

const getShortUrl = asyncHandler(async (req, res) => {
    const shorturl = req.params.id;
    const entry = await URL.findOneAndUpdate(
        {
            shortId: shorturl
        },
        {
            $push: {
                visitHistory: {
                    timeStamp: Date.now()
                }
            }
        }
    )
    if (!entry) {
        throw new ApiError(404, "No url found")
    }
    const redirectval = entry.redirectUrl;
    res.status(200).redirect(redirectval);
})

const analytics = asyncHandler(async(req,res)=>{
    const shorturl = req.params.id;
    const entry = await URL.findOne(
        {
            shortId:shorturl
        }
    )
    const output = {
        noOfVisits: entry.visitHistory.length,
        visits: entry.visitHistory
    }
    return res.status(200).json(output);
})

export {
    createShortUrl,
    getShortUrl,
    analytics
}