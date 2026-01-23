import img456 from '../../assets/img/players/456/456.png';
import icon456 from '../../assets/img/players/456/456-icon.png';
import img390 from '../../assets/img/players/390/390.png';
import icon390 from '../../assets/img/players/390/390-icon.png';
import img120 from '../../assets/img/players/120/120.png';
import icon120 from '../../assets/img/players/120/120-icon.png';
import img388 from '../../assets/img/players/388/388.png';
import icon388 from '../../assets/img/players/388/388-icon.png';
import img246 from '../../assets/img/players/246/246.png';
import icon246 from '../../assets/img/players/246/246-icon.png';
import img222 from '../../assets/img/players/222/222.png';
import icon222 from '../../assets/img/players/222/222-icon.png';
import img333 from '../../assets/img/players/333/333.png';
import icon333 from '../../assets/img/players/333/333-icon.png';
import img149 from '../../assets/img/players/149/149.png';
import icon149 from '../../assets/img/players/149/149-icon.png';
import img007 from '../../assets/img/players/007/007.png';
import icon007 from '../../assets/img/players/007/007-icon.png';
import img230 from '../../assets/img/players/230/230.png';
import icon230 from '../../assets/img/players/230/230-icon.png';

const imageMap = {
    '456': { fullBody: img456, portrait: icon456 },
    '390': { fullBody: img390, portrait: icon390 },
    '120': { fullBody: img120, portrait: icon120 },
    '388': { fullBody: img388, portrait: icon388 },
    '246': { fullBody: img246, portrait: icon246 },
    '222': { fullBody: img222, portrait: icon222 },
    '333': { fullBody: img333, portrait: icon333 },
    '149': { fullBody: img149, portrait: icon149 },
    '007': { fullBody: img007, portrait: icon007 },
    '230': { fullBody: img230, portrait: icon230 }
};

function getImagePath(playerId, type = 'fullBody') {
    if (!playerId) {
        return `https://via.placeholder.com/400x500/ff0000/ffffff?text=Error`;
    }

    const character = imageMap[playerId];
    if (!character) {
        return `https://via.placeholder.com/400x500/666666/ffffff?text=Player+${playerId}`;
    }

    const image = character[type];
    if (!image) {
        return `https://via.placeholder.com/400x500/666666/ffffff?text=${playerId}+${type}`;
    }

    return image;
}

function discoverAllCharacters() {
    return Object.keys(imageMap);
}

function preloadImage(imageUrl) {
    return new Promise((resolve) => {
        if (!imageUrl || imageUrl.includes('placeholder')) {
            resolve({ success: false, url: imageUrl, reason: 'placeholder' });
            return;
        }

        const img = new Image();
        img.onload = () => resolve({ success: true, url: imageUrl });
        img.onerror = () => resolve({ success: false, url: imageUrl, reason: 'load_error' });
        img.src = imageUrl;
    });
}

async function preloadCharacterImages(playerId) {
    const fullBodyUrl = getImagePath(playerId, 'fullBody');
    const portraitUrl = getImagePath(playerId, 'portrait');
    
    const [fullBodyResult, portraitResult] = await Promise.all([
        preloadImage(fullBodyUrl),
        preloadImage(portraitUrl)
    ]);
    
    return {
        playerId,
        fullBody: fullBodyResult,
        portrait: portraitResult,
        success: fullBodyResult.success && portraitResult.success
    };
}

async function preloadAllCharacterImages(playerIds = null) {
    const characters = playerIds || discoverAllCharacters();
    const results = await Promise.all(
        characters.map(playerId => preloadCharacterImages(playerId))
    );
    return results;
}

function testCharacterImage(playerId) {
    const fullBody = getImagePath(playerId, 'fullBody');
    const testImg = new Image();
    testImg.src = fullBody;
}

function imageExists(playerId, type = null) {
    const character = imageMap[playerId];
    if (!character) return false;
    
    if (type === null) {
        return !!(character.fullBody && character.portrait);
    }
    
    return !!character[type];
}

function getCharacterImages(playerId) {
    return {
        fullBody: getImagePath(playerId, 'fullBody'),
        portrait: getImagePath(playerId, 'portrait'),
        hasFullBody: imageExists(playerId, 'fullBody'),
        hasPortrait: imageExists(playerId, 'portrait'),
        inMapping: !!imageMap[playerId]
    };
}

function getImageStats() {
    const characters = Object.keys(imageMap);
    return {
        totalCharacters: characters.length,
        characters: characters,
        imageMap: imageMap
    };
}

export {
    getImagePath,
    discoverAllCharacters,
    preloadCharacterImages,
    preloadAllCharacterImages,
    testCharacterImage,
    getImageStats,
    imageExists,
    getCharacterImages
};