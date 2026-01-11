import { Octokit } from "octokit"
import type { BlogHeader, GitRevision, PortfolioClientHeaderResponse, PostData, ProjectHeader } from "./types";

const OWNER = "kakumuo"; 
const BLOG_REPO = "blog"; 
const BLOG_HEAD_FNAME = "blog.json";
const PROJ_HEAD_FNAME = "project.json";


type GitContentData = {
    type: "dir" | "file" | "submodule" | "symlink";
    size: number;
    name: string;
    path: string;
    content?: string;
    sha: string;
    url: string;
    git_url: string | null;
    html_url: string | null;
    download_url: string | null;
    _links: {
        git: string | null;
        html: string | null;
        self: string;
    };
}

export class PortfolioClient {
    octokit:Octokit

    constructor() {
        this.octokit = new Octokit(); 
    }

    private debug(type?:'info'|'error', ...data:any[]) {
        console.debug(`PortfolioClient ${type && type == 'error' ? "Error" : ""}:`, ...data); 
    }

    private async getHeaderData({ids, type}:{type:'blog'|'project', ids?:string[]}):Promise<BlogHeader[] | ProjectHeader[]>{
        const resp = await this.octokit.rest.repos.getContent({
            owner: OWNER, 
            repo: BLOG_REPO
        } as any); 

        if(resp.status != 200) {
            this.debug("error", `Unable to get ${type} repo content`, resp.data); 
            return []; 
        }
        
        const respContent = (resp.data as GitContentData[]).find(val => val.name == (type == "blog" ? BLOG_HEAD_FNAME : PROJ_HEAD_FNAME)); 

        if(!respContent) {
            this.debug("error", `Unable to find ${type} file from response data`); 
        }

        const blobResp = await this.octokit.rest.git.getBlob({
            owner: OWNER, 
            repo: BLOG_REPO, 
            file_sha: respContent?.sha
        } as any); 

        if(blobResp.status != 200) {
            this.debug("error", `Unable to pull ${type} blob`, blobResp.data); 
        }

        const fileData = JSON.parse(atob(blobResp.data.content)) as PortfolioClientHeaderResponse<any>; 
        
        if(ids) {
            return fileData.data.filter((val: { id: string; }) => ids.includes(val.id)); 
        }
        return fileData.data; 
    }

    async getBlogHeader({ids}:{ids?:string[]}) {
        return this.getHeaderData({ids, type: 'blog'}) as Promise<BlogHeader[]>
    }

    async getProjectHeader({ids}:{ids?:string[]}) {
        return this.getHeaderData({ids, type: 'project'}) as Promise<ProjectHeader[]>
    }

    async getPostData({id}:{id:string}) : Promise<PostData>{
        const resp = await this.octokit.rest.repos.getContent({
            owner: OWNER, 
            repo: BLOG_REPO, 
            path: `posts/${id}`
        } as any); 

        if(resp.status != 200) {
            this.debug("error", `Unable to get post repo content`, resp.data); 
            return {} as PostData; 
        }

        const postData:PostData = {
            attachments: [], 
            postContent: "", 
            previewImage: "",
        } as PostData; 

        for(let item of (resp.data as GitContentData[])) {            
            if(item.name == "post.md") {
                const itemResp = await this.octokit.rest.git.getBlob({
                    owner: OWNER, 
                    repo: BLOG_REPO, 
                    file_sha: item.sha
                }); 

                postData.postContent = atob(itemResp.data.content);  
            } else if(item.name.match(/preview\.(png|jpg|jpeg|gif)/) && item.download_url) {
                postData.previewImage = item.download_url; 
            } else if (item.name.match(/\.(png|jpg|jpeg|gif)$/) && item.download_url){
                postData.attachments.push(item.download_url); 
            }
        }

        return postData; 
    }

    async getPostChangelog({id}:{id:string}){
        const resp = await this.octokit.rest.repos.getCommit({
            owner: OWNER, 
            repo: BLOG_REPO, 
            path: `posts/${id}`
        } as any); 

        if(resp.status != 200) {
            this.debug("error", `Unable to get post repo content`, resp.data); 
            return []; 
        }
        
        const commits:GitRevision[] = []; 
        const respArr = (resp.data as unknown) as (typeof resp.data)[]; 
        
        for(let cur of respArr) {
            //TODO: add back
            // if(cur.commit.message.match(/\[ignore\]/)) {
            //     continue; 
            // }

            let curCommit:GitRevision = {} as GitRevision; 
            curCommit.id = cur.sha; 
            curCommit.body = cur.commit.message.split("/n").filter((_, i) => i > 0).join("\n"); ; 
            curCommit.url = cur.html_url; 
            curCommit.title = cur.commit.message.split("/n")[0]; 
            curCommit.date = 0; 
            
            if(cur.commit.author?.date) {
                curCommit.date = Date.parse(cur.commit.author.date)
            }

            commits.push(curCommit); 
        }

        return commits; 
    }

    async getProjectChangelog({linkOrId}:{linkOrId:string}){
        let targetLink = linkOrId; 
        if(!linkOrId.match(/.*github\.com/)) {
            const header = await this.getProjectHeader({ids: [linkOrId]})
            if(!header[0].git) return []
            
            targetLink = header[0].git; 
        }

        const linkpath = targetLink.split("/").reverse(); 
        const owner = linkpath[1]; 
        const repo = linkpath[0]; 

        console.log(owner, repo)

        const resp = await this.octokit.rest.repos.getCommit({owner, repo, per_page: 5} as any); 

        if(resp.status != 200) {
            this.debug("error", `Unable to get post repo content`, resp.data); 
            return []; 
        }
        
        const commits:GitRevision[] = []; 
        const respArr = (resp.data as unknown) as (typeof resp.data)[]; 
        
        for(let cur of respArr) {
            //TODO: add back
            // if(cur.commit.message.match(/\[ignore\]/)) {
            //     continue; 
            // }

            let curCommit:GitRevision = {} as GitRevision; 
            curCommit.id = cur.sha; 
            curCommit.body = cur.commit.message.split("/n").filter((_, i) => i > 0).join("\n"); ; 
            curCommit.url = cur.html_url; 
            curCommit.title = cur.commit.message.split("/n")[0]; 
            curCommit.date = 0; 
            
            if(cur.commit.author?.date) {
                curCommit.date = Date.parse(cur.commit.author.date)
            }

            commits.push(curCommit); 
        }

        return commits; 
    }
}