

type GitRevision = {
    id:string, 
    title: string, 
    date:number, 
    body:string, 
    url:string
}

type GitChangelog = {title:string, gitLink:string, changeItems:GitRevision[]}


// type BaseHeader = {
//     id:string, 
//     title:string
// }

type BlogHeader = {
    id: string, 
    title:string, 
    createDate:number, 
    tags:string[], 
    summary:string, 
    bannerImage:string,
}

type ProjectHeader = {
    id: string, 
    title: string, 
    startDate: number, 
    endDate: number, 
    type: "craft" | "web-app" | "desktop-app", 
    taskSize: "small" | "medium" | "large" | "xlarge", 
    complexity: "easy" | "medium" | "difficult", 
    status: "brainstorming" | "inprogress" | "complete" | "released" | "dropped", 
    git?: string, 
    url?:string, 
    summary: string, 
    hasPost?:boolean, 
    makeupLayers:MakeupLayer[]
}

type MakeupLayer = {
    name:string, 
    items: {tech:string, percentage:number}[]
}

type PortfolioClientResponse<T> = {
    success:true, 
    data:T
} | {
    success:false, 
    errorCode:number,
    message:string
}

type PostData = {
    postContent:string, 
    previewImage?:string, 
    attachments?:string[]
}


type PostPageData = {
    isProject:boolean, 
    headerData:ProjectHeader[] | BlogHeader[], 
    postData:PostData, 
    postChangelog:GitRevision[], 
    projChangelog:GitRevision[],
}

type PostPageResponseData = {
    isProject:boolean, 
    headerData:PortfolioClientResponse<ProjectHeader[] | BlogHeader[]>, 
    postData:PortfolioClientResponse<PostData>, 
    postChangelog:PortfolioClientResponse<GitRevision[]>, 
    projChangelog:PortfolioClientResponse<GitRevision[]>,
}

type Preload<T> = {
    [K in keyof T]: Promise<T[K]>
}

export type {
    GitRevision, 
    GitChangelog, 
    ProjectHeader, 
    BlogHeader, 
    MakeupLayer, 
    PortfolioClientResponse, 
    PostPageResponseData,
    PostData, 
    PostPageData, 
    Preload
}


