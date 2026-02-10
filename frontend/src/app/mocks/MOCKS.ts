
import { MuscleGroup } from "../enum/type.enums"

export const EXERCISES_MOCK = 
[
    {id: 1, name:'Bench Press', picture: null, muscle:MuscleGroup.Chest, description:'Bench press is on of the main exercise who wants to....'},
    {id: 2, name:'Incline Dumbell Fly', picture: null, muscle:MuscleGroup.Chest, description:'Incline Dumbell Fly is on of the main exercise who wants to....'},
    
    {id: 3, name:'Leg Press', picture: null, type:MuscleGroup.Legs, description:'Leg is on of the main exercise who wants to...'}

]

export const WORKOUTS_MOCK = 
[
    {id:1, name:"Bench Workout", exercises:[EXERCISES_MOCK[0],EXERCISES_MOCK[1]], description:"With this complete workout you can..", type:MuscleGroup.Chest, duration:10}
]