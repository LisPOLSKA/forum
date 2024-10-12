import express  from "express";
import {getRelationships, addRelationship, deleteRelationship, getSuggestions, getInvite, acceptRelationship} from "../controllers/relationship.js"

const router = express.Router()

router.get("/",getRelationships)
router.post("/", addRelationship)
router.delete("/", deleteRelationship)
router.get("/suggestions", getSuggestions)
router.get("/invite/:id", getInvite);
router.post("/accept", acceptRelationship)

export default router