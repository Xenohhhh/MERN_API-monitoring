import { User } from "../models/user.models.js"
import { Monitor } from "../models/monitors.models.js"
import { PLAN_LIMITS } from "../config/plans.js"
import monitorQueue from "../../../worker/queue.js";
import {MonitorLog} from "../models/monitorLog.models.js"


export const postFunction = async (req, res) => {
    try {
        const { name, url, interval } = req.body
        const normalizedInterval = Number(interval);

        if (!name || !url || !normalizedInterval) {
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

        if (!PLAN_LIMITS[req.user.plan]) {
            return res.status(400).json({
                message: "Invalid user plan"
            });
        }

        if (![60, 300, 600].includes(normalizedInterval)) {
            return res.status(400).json({
                message: "Interval must be 60, 300, or 600 seconds"
            });
        }

        const existingCount = await Monitor.countDocuments({
            userId: req.user._id,
            isActive: true
        })

        const limit = PLAN_LIMITS[req.user.plan];


        if (existingCount >= limit) {
            return res.status(403).json({
                message: `Monitor limit reached for your ${req.user.plan} plan (${existingCount}/${limit})`,
                plan: req.user.plan,
                currentCount: existingCount,
                limit
            });
        }

        const monitor = await Monitor.create({
            userId: req.user._id,
            name,
            url,
            interval: normalizedInterval
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
        const { id } = req.params;

        const monitor = await Monitor.findOne({
            _id: id,
            userId: req.user._id
        });

        if (!monitor) {
            return res.status(404).json({
                message: "Monitor not found"
            });
        }

        // Remove repeat job
        await monitorQueue.removeRepeatable(
            "monitor-api",
            {
                every: monitor.interval*1000,
            },
            id
        );

        // Delete from DB
        await monitor.deleteOne();

        return res.status(200).json({
            message: "Monitor deleted successfully"
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "Server error"
        });
    }
};

export const getMonitorLogs = async (req, res) => {
  try {
    const { id } = req.params;

    // Pagination
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const skip = (page - 1) * limit;

    // Ownership check
    const monitor = await Monitor.findOne({
      _id: id,
      userId: req.user._id,
    });

    if (!monitor) {
      return res.status(404).json({
        message: "Monitor not found",
      });
    }

    // Fetch logs
    const logs = await MonitorLog.find({ monitorId: id })
      .sort({ checkedAt: -1 })
      .skip(skip)
      .limit(limit);

    // Total count
    const total = await MonitorLog.countDocuments({ monitorId: id });

    return res.status(200).json({
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
      logs,
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Server error",
    });
  }
};
