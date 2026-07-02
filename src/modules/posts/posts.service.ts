import { CommnetStatus, PostStatus } from "../../../generated/prisma/enums"
import { PostWhereInput } from "../../../generated/prisma/models"
import { prisma } from "../../lib/prisma"
import { ICreatePostPayload, IPostQuery, IUpdatePostPayload } from "./posts.interface"

const createPostsIntoDB = async(
    payload:ICreatePostPayload,
    userId:string

)=>{


    const result = await prisma.post.create({
        data :{
            ...payload,
            authorid:userId
        }
    })
    return result

}




const getPostsIntoDB = async(query:IPostQuery)=>{

    const limit = query.limit? Number(query.limit):10;
    const page = query.page? Number(query.page):1;
    const skip = (page-1)*limit;
    const sortBy = query.sortBy?query.sortBy:"createdAt";
    const sortOrder = query.sortOrder?query.sortOrder:"desc";
     
    const tags = query.tags?JSON.parse(query.tags as string) : null;
    const tagsArray = Array.isArray (tags)?tags:[];
    const andCondition : PostWhereInput[]=[];

    if(query.searchTerm){
        andCondition.push({
             OR:[
                    {
                        title:{
                            contains:query.searchTerm,
                            mode:"insensitive"
                        },

                      
                    },
                    {
                           content:{
                            contains:query.searchTerm,
                            mode:"insensitive"
                        }
                    }
                ]
        })
    }

    if(query.title){
        andCondition.push({
            title:query.title
        })
    }

    if(query.content){
        andCondition.push({
            content:query.content
        })
    }

    if(query.authorid){
        andCondition.push({
            authorid:query.authorid
        })
    }

    if(query.isFeatured){
        andCondition.push({
            isFeatured:query.isFeatured
        })
    }

    if(query.tags){
        andCondition.push({
            tags:{
                hasSome:tagsArray
            }
        })
    }

     if(query.status){
        andCondition.push({
            status:query.status
        })
     }

    const result = await prisma.post.findMany(
        {
        //   filtering/exact match without AND operator

            // where:{
            //     title:"choclate updated",
            //     content:"react"
            // },
            

            //    filtering/exact match with AND operator
            // where:{
            //   AND:[
            //     {
            //    title:"choclate updated"
            //     },
            //     {
            //         content:"React" 
            //     },
            //     {
            //         tags:{
            //             equals:[
            //     "react",
            //     "javascript",
            //     "frontend"
            // ]
            //         }
            //     }
            //   ]
            // },
            


            // searching /partial match

        //  where:{
        //     title:{
        //     contains:"Chocolate",
        //     mode:"insensitive"
        //     },
        //     content:{
        //         contains:"Ronaldo"
        //     }

        //  },

         // searching /partial match with or operator

        //  where:{
        //     OR:[
        //    {
        //          title:{
        //     contains:"Chocolate",
        //     mode:"insensitive"
        //     }
        //    },
        //    {
        //        content:{
        //         contains:"Ronaldo"
        //     }
        //    }
        //     ]
        //  },


        // combine search (or operator) and filtering(AND)

        // where:{
        //     // filtering and searching combine
        //     AND:[

        //         {
        //             // Searching
        //             OR:[
        //                 {
        //                    title:{
        //                     contains:"choco",
        //                     mode:"insensitive"
        //                    }
        //                 },
        //                 {
        //                     content:{
        //                         contains:"Rea",
        //                         mode:"insensitive"
        //                     }
        //                 }
        //             ]
        //         },

        //         // filtering
                
        //         {
        //          title:"chocolate updated"
        //         },
        //         {
        //             content:"React"
        //         }
        //     ]

        // },

        // take:1,
        // skip:5,

        // page 4 = limit/take = 1 => skip: (page-1) *limit;

        

        // sorting in asc/dsc order or specific fields

        // orderBy:{
        //     createdAt:"asc",
        //     title:"desc",
        //     content:"asc",
        //     // fieldname:asc/dsc

        // },
        
        where:{
         AND:andCondition

        },

        take:limit,
        skip:skip,
        

        orderBy:{
            
            [sortBy]:sortOrder
        },
            include:{
                author:{
                    omit:{
                        password:true
                    }
                },
                comments:true

            }
        }
    )
    return result

}

const getPostsStatsIntoDB = async () => {
  const transactionResult = await prisma.$transaction(async (tx) => {
    const [
      totalPosts,
      totalPublishedPost,
      totalDraftPost,
      totalArchievePost,
      totalComments,
      totalApprovedComments,
      totalRejectedComments,
      totalViewsAggregate,
    ] = await Promise.all([
      tx.post.count(),

      tx.post.count({
        where: {
          status: PostStatus.PUBLISHED,
        },
      }),

      tx.post.count({
        where: {
          status: PostStatus.DRAFT,
        },
      }),

      tx.post.count({
        where: {
          status: PostStatus.ARCHIEVE,
        },
      }),

      tx.comment.count(),

      tx.comment.count({
        where: {
          status: CommnetStatus.APPROVED,
        },
      }),

      tx.comment.count({
        where: {
          status: CommnetStatus.REJECT,
        },
      }),

      tx.post.aggregate({
        _sum: {
          views: true,
        },
      }),
    ]);

    return {
      totalPosts,
      totalPublishedPost,
      totalDraftPost,
      totalArchievePost,
      totalComments,
      totalApprovedComments,
      totalRejectedComments,
      totalViews: totalViewsAggregate._sum.views ?? 0,
    };
  });

  return transactionResult;
};
const getMyPostsIntoDB = async(authorid:string)=>{

    const result = await prisma.post.findMany({
        where:{
         authorid
        },

        orderBy:{
            createdAt:"desc"
        },
        include:{
            comments:true,
            author:{
                omit:{
                    password:true
                }
            },
            _count:{
                select:{
                    comments:true
                }
            }
        }

    })
    return result

}

const getPostsByIdIntoDB = async (postId: string) => {
    const transactionResult = await prisma.$transaction(async (tx) => {
        await tx.post.update({
            where: {
                id: postId,
            },
            data: {
                views: {
                    increment: 1,
                },
            },
        });

        // throw new Error("fake error");
        

        const post = await tx.post.findUniqueOrThrow({
            where: {
                id: postId,
            },
            include: {
                author: {
                    omit: {
                        password: true,
                    },
                },
                comments: {
                    where: {
                        status: CommnetStatus.APPROVED,
                    },
                    orderBy: {
                        createdAt: "desc",
                    },
                },
                _count: {
                    select: {
                        comments: true,
                    },
                },
            },
        });

        return post;
    });

    return transactionResult;
};


const updatePostsIntoDB = async(postId:string,payload:IUpdatePostPayload,authorid:string,isAdmin:boolean)=>{

  const post = await prisma.post.findUniqueOrThrow({
    where:{
        id:postId
    }

  })
      if(!isAdmin && post.authorid !==authorid ){
        throw new Error("You are not owner in this post");
        

    }

    const result = await prisma.post.update({
        where:{
            id:postId
        },
        data:payload,
          include: {
        author: {
            omit: {
                password: true,
            },
        },
        comments: true,
    },

    })
    return result




    
}

const deletePostsByIdIntoDB = async(postId:string,authorid:string,isAdmin:boolean,)=>{
  const post = await prisma.post.findUniqueOrThrow({
    where:{
        id:postId
    }

  })
      if(!isAdmin && post.authorid !==authorid ){
        throw new Error("You are not owner in this post");
        

    }


 await prisma.post.delete({
    where:{
        id:postId
    }
})



} 

export const postServices = {
    getPostsIntoDB,
    getPostsStatsIntoDB,
    getMyPostsIntoDB,
    getPostsByIdIntoDB,
    createPostsIntoDB,
    updatePostsIntoDB,
    deletePostsByIdIntoDB



}