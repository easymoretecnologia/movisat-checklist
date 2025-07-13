export enum Time {
    second = 1,
    minute = Time.second * 60,
    hour = Time.minute * 60,
    day = Time.hour * 24,
    week = Time.day * 7,
    month = Time.day * 30,
    year = Time.day * 365
}