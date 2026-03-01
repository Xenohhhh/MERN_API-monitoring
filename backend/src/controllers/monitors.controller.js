import { User } from "../models/user.models.js"
import { Monitor } from "../models/monitors.models.js"
import { PLAN_LIMITS } from "../config/plans.js"


export const postFunction = async (req, res) => {
    try {
        const { name, url, interval } = req.body

        if (!name || !url || !interval) {
            return res.status(400).json({
                message: "All fields should be present"
            })
        }

        const valid = url.startsWith("http://") || url.startsWith("https://")
        if (!valid) {
            return res.status(400).json({
                message: "URL must start with http:// or https://"
            })
        }

        const existingCount = await Monitor.countDocuments({
            userId: req.user._id,
            isActive: true
        })

        const limit = PLAN_LIMITS[req.user.plan];


        if (existingCount >= limit) {
            return res.status(403).json({
                message: "Monitor limit reached for your plan"
            });
        }

        const monitor = await Monitor.create({
            userId: req.user._id,
            name,
            url,
            interval
        });


        return res.status(201).json({
            message: "Monitor created successfully",
            monitor
        });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "Server error"
        });
    }


}

export const getFunction = async (req, res) => {
    try {
        const userId = await User.findById(req.user._id)

        const monitors = await Monitor.find({
            userId: userId
        })
            .sort({ createdAt: -1 })

        return res.status(200).json({
            monitors
        });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "Server error"
        })
    }
}

export const deleteFunction = async (req, res) => {
    try {
        const { id } = req.params

        const monitor = await Monitor.findOne({
            _id: id,
            userId: req.user._id
        })

        if (!monitor) {
            return res.status(404).json({
                message: "Monitor not found"
            });
        }

        await monitor.deleteOne();

        return res.status(200).json({
            message: "Monitor deleted successfully"
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "Server error"
        })
    }
}