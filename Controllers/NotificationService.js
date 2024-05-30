// notificationService.js

const schedule = require("node-schedule");

class NotificationService {
  static async scheduleNotification(rendezVousId, date) {
    // Schedule notification 1 day before rendezVous
    const job = schedule.scheduleJob(
      new Date(date.getTime() - 24 * 60 * 60 * 1000),
      async () => {
        console.log(
          `Scheduled notification for rendezVousId: ${rendezVousId} one day before.`
        );
        // Implement notification logic here
      }
    );
    return job;
  }

  static async sendNotification(rendezVousId, message) {
    console.log(
      `Sending reminder notification for rendezVousId: ${rendezVousId}`
    );
    // Implement notification logic here
  }
}

module.exports = NotificationService;
