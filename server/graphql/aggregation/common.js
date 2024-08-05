const UNWIND_STAGE = (stage) =>  {
    const path_ = "$"+stage
    return {
      $unwind:
      {
        path: path_,
      }
    }
}
const LIMIT_STAGE = (limit) => {
    return {
      $limit:limit 
    }
  }  

  const SKIP_STAGE = (skip) => {
    return {
      $skip:skip 
    }
  } 

  const SORT_CREATED_AT_DESC = {
    $sort: 
    {
        createdAt : -1
    }
}
const LOOKUP_STAGE = (fromCollection,localFieldName,foreignFieldName,returnFieldName) =>{
    return {
        $lookup:
        {
          from: fromCollection,
          localField: localFieldName,
          foreignField:foreignFieldName,
          as: returnFieldName,
        }
    }

  }

  const PROJECT_FIELD_SLICE = (fieldName, skip , limit) =>{
    const field = "$"+fieldName
    return {
        $project:
        {
            _id: 0,
            Posts: { $slice: [field, skip, limit] }
        }  
    }
 }

exports.UNWIND_STAGE = UNWIND_STAGE  
exports.LIMIT_STAGE = LIMIT_STAGE
exports.SKIP_STAGE = SKIP_STAGE
exports.LOOKUP_STAGE = LOOKUP_STAGE
exports.SORT_CREATED_AT_DESC = SORT_CREATED_AT_DESC
exports.PROJECT_FIELD_SLICE = PROJECT_FIELD_SLICE