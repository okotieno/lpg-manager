import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { DispatchEvent } from '../events/dispatch.event';
import { ActivityLogBackendService } from '@lpg-manager/activity-log-service';
import { NotificationService } from '@lpg-manager/notification-service';
import { UserService } from '@lpg-manager/user-service';
import { DriverService } from '@lpg-manager/driver-service';

@Injectable()
export class DispatchEventsListener {

  constructor(
    private activityLogService: ActivityLogBackendService,
    private notificationService: NotificationService,
    private userService: UserService,
    private driverService: DriverService
  ) {
  }

  @OnEvent('dispatch.depotToDriverConfirmed')
  async informDriverOfDepotConfirmation(event: DispatchEvent) {

    const dispatch = event.dispatch;

    // Create activity log
    await this.activityLogService.create({
      action: 'dispatch.depotToDriverConfirmed',
      description: `Dispatch #${dispatch.id.slice(-8)} confirmed by depot`,
      type: 'INFO',
      userId: event.userId,
    });

    // Get the driver's user ID to send notification
    const driver = await this.driverService.model.findOne({
      where: { id: dispatch.driverId }
    });

    if (driver) {
      await this.notificationService.sendNotification(
        'Load Confirmed by Depot',
        `Dispatch #${dispatch.id.slice(-8)} has been confirmed by depot. You can now start your deliveries.`,
        [driver.userId]
      );
    }

    // Notify depot users
    // await this.notificationService.notifyStationUsers(dispatch.depotId, {
    //   title: 'Dispatch Load Confirmed',
    //   description: `Dispatch #${dispatch.id.slice(-8)} has been confirmed for driver ${
    //     dispatch.driver.user.firstName
    //   } ${dispatch.driver.user.lastName}`,
    // });
  }
}
