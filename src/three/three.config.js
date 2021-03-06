/* global __ENV__ */

export default {
    isDev: __ENV__ == 'development',
    isLoaded: false,
    dpr: 1,
    camera: {
        fov: 40,
        near: 2,
        far: 1000,
        aspect: 1,
        posX: 0,
        posY: 30,
        posZ: 1000,
    },
    controls: {
        enableDamping: true,
        dampingFactor: 0.25,
        enableZoom: true,
    },
};
