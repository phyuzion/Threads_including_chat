


const checkSuperAdmin =  (req) => {
    console.log('checkSuperAdmin')
    if (!req.user || req.user.userType > USER_TYPES.SUPER_ADMIN ) {
        throwForbiddenError()
    }
    return true
 }