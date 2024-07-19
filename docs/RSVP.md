# Event Calendar function (version 1.0) 2024-05-30

## Introduction

This is the Event Calendar for showing events and make the user register the events

## Feature

-   ✅Dynamic view (Monthly, Weekly)
-   ✅Event filtering (By location)
-   ✅RSVP Events
-   ✅Email confirmation
-   ✅Email cancellation
-   ✅RSVP history log

## RSVP process

-   ✅ Non user received unique unit number called ID
-   ✅ User can't register exact date of event ex) Chinese cooking class start 9:00 AM 21st May.
    User can't register the event at 21st May

-To Register: Non login user Do register => get confirmation email => go to confirm landing page =>
click confirm => store record and log data => registration is done

-To Cancel: Non login user After confirm user, get the registration confirm email => go to cancel
landing page =>click cancel => delete the record and adding cancel log data => user get cancel
confirm email

## Component Structure

```
── Event-calendar
  ├── Constants                               Variables: SMA fields etc...
  ├── EC-Util                                 Util func only for calendar
  ├── Spinner                                 Loading view spinner
  ├── Service                                 AJAX Calls
  ├── EventCalendar                           Root
      ├── EventCalendarFilter                 location filtering
      └── EventCalendarEventList              Month View or Week View
          ├── EventSumButton                  Month:event summary modal
              └── EventRSVPForm
          ├── EventButton                     Month and Week:event common modal
              └── EventRSVPForm
          └── EventAllButton                  Month:all event modal
              └── EventRSVPForm
  ├── RSVPCancelConfirmTmp.txt               Email tmp for cancellation confirm(3)
  ├── RSVPRegConfirmTmp.txt                  Email tmp for Registration confirm(2)
  └── RSVPVerificationConfirmTmp.txt         Email tmp for email verification(1)
```

## Database Structure

\*Developed based on Norfolk library website

Username: norfolk_m2l_mgr Main: M2L_TAG For contact info: LIBRARY_LOCATION For RSVP log:
TAG_RSVP_PATRON_LOG

## MINISIS Report Structure

Username: norfolk_m2l_mgr Main: MONTHLY_CALENDAR_NEW_T4
