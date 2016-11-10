'use strict';

module.exports.get = function (collection, startPoint, depth) {
    let friendList;
    let isValidStartPoint = findInPhoneBook(startPoint);
    isValidStartPoint && populateFriendList();
    let positionInList = -1;
    let phoneBookLength = Object.keys(collection).length;

    function findInPhoneBook(startPoint) {
        return Boolean(collection[startPoint]);
    }

    function getFriendByName(friendName) {
        return collection[friendName];
    }

    function populateFriendList(maxDepth = depth, currentDepth = 1, friendListArr = [startPoint]) {
        let matchesInIteration = 0;
        let updatedFriendListArr = [...friendListArr];

        for (let friendName of friendListArr) {
            getFriendByName(friendName).friends.forEach(friend => {
                if (!friendListArr.includes(friend) && currentDepth !== maxDepth + 1) {
                    matchesInIteration++;
                    updatedFriendListArr.push(friend);
                }
            });
        }

        if (matchesInIteration) {
            let newDepth = currentDepth + 1;
            populateFriendList(maxDepth, newDepth, updatedFriendListArr);
        } else {
            if (!friendList) {
                friendList = updatedFriendListArr.slice(1);
            }
            return;
        }
    }


    function viewFriendInfo(positionInList) {
        let friendName = friendList ? friendList[positionInList] : undefined;
        let friendObj = collection[friendName];
        if (isValidStartPoint && friendObj) {
            return {
                name: friendName,
                phone: friendObj['phone']
            };
        } else {
            return null;
        }
    }

    function checkGender(friendName) {
        return collection[friendName]['gender'];
    }

    function checkForPhonebookChanges() {
        let newEntries = Object.keys(collection);

        if (newEntries.length !== phoneBookLength) {
            phoneBookLength = newEntries.length;
            for (var entry in collection) {
                collection[entry].friends = collection[entry].friends.filter(friend => {
                    return newEntries.includes(friend);
                });
            }
            populateFriendList();
        }
    }

    function next(goTo) {
        checkForPhonebookChanges();
        positionInList++;
        if (goTo) {
            positionInList = friendList.indexOf(goTo);
        }
        let friend = viewFriendInfo(positionInList);
        return friend ? friend : null;
    }

    function prev(goTo) {
        checkForPhonebookChanges();
        positionInList--;
        let friend = viewFriendInfo(positionInList);
        return friend ? friend : null;
    }

    function nextMale(goTo) {
        checkForPhonebookChanges();
        positionInList++;
        let friend = viewFriendInfo(positionInList);
        while (friend !== null && checkGender(friend.name) !== 'Мужской') {
            positionInList++;
            friend = viewFriendInfo(positionInList);
        }
        return friend ? friend : null;
    }

    function prevMale(goTo) {
        checkForPhonebookChanges();
        positionInList--;
        let friend = viewFriendInfo(positionInList);
        while (friend !== null && checkGender(friend.name) !== 'Мужской') {
            positionInList--;
            friend = viewFriendInfo(positionInList);
        }
        return friend ? friend : null;
    }

    return {
        next,
        prev,
        nextMale,
        prevMale
    };
};
