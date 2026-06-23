
class ApiResponse{
    constructor(statusCode,data,message="sucess",sucess="sucess"){
        this.statusCode=statusCode,
        this.data=data,
        this.message=message,
        this.sucess=sucess
    }

}

export {ApiResponse}