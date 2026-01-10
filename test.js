import { Octokit } from "octokit";


const OWNER = "kakumuo"; 
const BLOG_REPO = "blog"; 


(async() => {
    // Octokit.js
    // https://github.com/octokit/core.js#readme
    const octokit = new Octokit({})

    // const resp = await octokit.rest.repos.getContent({
    //     owner: OWNER, 
    //     repo: BLOG_REPO, 
    //     path: `posts/about-me`
    // }); 

    const resp = await octokit.rest.repos.getCommit({
        owner: OWNER, 
        repo: BLOG_REPO, 
        path: `posts/about-me`, 

    }); 

    for(let val of resp.data) {
        console.log(JSON.stringify(val))
    }
})(); 