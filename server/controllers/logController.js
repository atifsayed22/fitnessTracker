import DailyLog from '../models/DailyLog.js';
function isValidDateString(date) {
  if (typeof date !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    return false;
  }

  const parsed = new Date(`${date}T00:00:00.000Z`);
  if (Number.isNaN(parsed.getTime())) {
    return false;
  }

  return parsed.toISOString().slice(0, 10) === date;
}

function toNumber(value) {
  return Number(value);
}

function inRange(value, min, max) {
  return Number.isFinite(value) && value >= min && value <= max;
}

async function addLog(req, res, next) {
  try {
    const { date, calories, weight } = req.body;

    if (!isValidDateString(date)) {
      return res.status(400).json({ message: 'Date must be in YYYY-MM-DD format' });
    }

    const parsedCalories = toNumber(calories);
    const parsedWeight = toNumber(weight);

    if (!inRange(parsedCalories, 0, 10000)) {
      return res.status(400).json({ message: 'Calories must be between 0 and 10000' });
    }

    if (!inRange(parsedWeight, 0, 300)) {
      return res.status(400).json({ message: 'Weight must be between 0 and 300' });
    }

    const log = await DailyLog.findOneAndUpdate(
      { userId: req.user.id, date },
      {
        $set: {
          calories: Math.round(parsedCalories * 100) / 100,
          weight: Math.round(parsedWeight * 100) / 100
        }
      },
      {
        new: true,
        upsert: true,
        runValidators: true,
        setDefaultsOnInsert: true
      }
    );

    res.status(200).json({ message: 'Log saved successfully', log });
  } catch (error) {
    next(error);
  }
}

async function getLogs(req, res, next) {
  try {
    const logs = await DailyLog.find({ userId: req.user.id }).sort({ date: 1 }).lean();

    res.json({
      logs
    });
  } catch (error) {
    next(error);
  }
}

export { addLog, getLogs };