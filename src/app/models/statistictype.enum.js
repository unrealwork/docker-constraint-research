"use strict";
(function (StatisticType) {
    StatisticType[StatisticType["AVG"] = 'avg'] = "AVG";
    StatisticType[StatisticType["MIN"] = 'min'] = "MIN";
    StatisticType[StatisticType["MAX"] = 'max'] = "MAX";
    StatisticType[StatisticType["PCT95"] = 'pct95'] = "PCT95";
    StatisticType[StatisticType["PCT90"] = 'pct90'] = "PCT90";
    StatisticType[StatisticType["PCT99"] = 'pct99'] = "PCT99";
    StatisticType[StatisticType["ALL"] = ''] = "ALL";
})(exports.StatisticType || (exports.StatisticType = {}));
var StatisticType = exports.StatisticType;
