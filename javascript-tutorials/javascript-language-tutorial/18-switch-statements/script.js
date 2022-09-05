/*
    0 -> Sunday
    1 -> Monday
    ...
    5 -> Friday
    6 -> Saturday
 */

function getDayName(dayNum) {
    var day

    // Ordinary If Statements
    // if (dayNum == 0) {
    //     day = "Sunday"
    // } else if (dayNum = 1) {
    //     day = "Monday"
    // }

    switch (dayNum) {
        case 0:
            day = "Sunday"
            break
        case 1:
            day = "Monday"
            break
        case 2:
            day = "Tuesday"
            break
        case 3:
            day = "Wednesday"
            break
        case 4:
            day = "Thursday"
            break
        case 5:
            day = "Friday"
            break
        case 6:
            day = "Saturday"
            break
        default:
            day = "Day doesn't exit, " + dayNum + " isn't a valid number."
    }
    return day
}

document.write(getDayName(0))
