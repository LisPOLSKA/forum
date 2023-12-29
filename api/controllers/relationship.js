import {db} from "../connect.js";
import jwt from "jsonwebtoken";

export const getRelationships = (req, res) =>{
    const q = "SELECT CASE WHEN r.userId1 = ? THEN r.userId2 WHEN r.userId2 = ? THEN r.userId1 END AS friendId FROM relationships AS r WHERE status='accept' AND (r.userId1 = ? OR r.userId2 = ?)";

    db.query(q, [req.query.followedUserId, req.query.followedUserId, req.query.followedUserId, req.query.followedUserId], (err, data)=>{
        if (err) return res.status(500).json(err);
        return res.status(200).json(data.map(relationship=>relationship.friendId));
    });
};

export const addRelationship = (req,res) =>{
    const token = req.cookies.accessToken;
    if(!token) return res.status(401).json("Not logged in!")

    jwt.verify(token, "secretkey", (err, userInfo)=>{
        if(err) return res.status(403).json("Token is not valid!")

        const q = "INSERT INTO relationships (`userId1`, `userId2`) VALUES (?)";
        const values = [
            userInfo.id,
            req.body.userId
        ]

    db.query(q, [values], (err, data)=>{
        if (err) return res.status(500).json(err);
        return res.status(200).json("Zaproszenie zostało wysłane");
    });
    });
};

export const deleteRelationship = (req,res) =>{
    const token = req.cookies.accessToken;
    if(!token) return res.status(401).json("Not logged in!")

    jwt.verify(token, "secretkey", (err, userInfo)=>{
        if(err) return res.status(403).json("Token is not valid!")

        const q = "DELETE FROM relationships WHERE (`userId1` = ? AND `userId2` = ?) OR (`userId2` = ? AND `userId1` = ?)"

    db.query(q, [userInfo.id, req.query.userId, userInfo.id, req.query.userId], (err, data)=>{
        if (err) return res.status(500).json(err);
        return res.status(200).json("Znajomość została usunięta");
    });
    });
};