const zod = require('zod');

enum Priority {
    Urgent,
    High,
    Medium,
    Low,
    NoPriority
  }
const SignUPBody = zod.object({
    email: zod.string().email(),
    firstName : zod.string().min(1),
    lastName : zod.string().min(1),
    password: zod.string().min(1),
});

const SignInBody = zod.object({
    email: zod.string().email(),
    password: zod.string().min(1),
});

const AddTodoBody = zod.object({  
    title : zod.string().min(1),
    tag : zod.string().min(1),
    priority : zod.string(),
    progress : zod.string().optional()
}) 
const UpdateTodoBody = zod.object({
    id : zod.string(),
    title : zod.string().min(1).optional(),
    tag : zod.string().min(1).optional(),
    priority : zod.string().optional(),
    progress : zod.string().optional(),
});

const UpdateProfile = zod.object({
    firstName : zod.string().min(1).optional(),
    lastName : zod.string().min(1).optional(),
    password : zod.string().min(1).optional()
})


module.exports = {
    SignUPBody,
    SignInBody,
    AddTodoBody,
    UpdateTodoBody,
    UpdateProfile,
    
};