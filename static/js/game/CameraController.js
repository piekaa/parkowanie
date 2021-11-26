class CameraController {

    static #cameraZoomSpeed = 0.03;
    static #minCamera = 0.45;
    static #maxCamera = 4;
    static #game;

    static setup(game) {
        CameraController.#game = game;
        game.addBehaviour((params) => {
            if (params.keyDown("q")) {
                game.camera.sx -= CameraController.#cameraZoomSpeed;
                game.camera.sy -= CameraController.#cameraZoomSpeed;
                if (game.camera.sx < CameraController.#minCamera) {
                    game.camera.sx = CameraController.#minCamera;
                    game.camera.sy = CameraController.#minCamera;
                }
            }
            if (params.keyDown("e")) {
                game.camera.sx += CameraController.#cameraZoomSpeed;
                game.camera.sy += CameraController.#cameraZoomSpeed;
                if (game.camera.sx > CameraController.#maxCamera) {
                    game.camera.sx = CameraController.#maxCamera;
                    game.camera.sy = CameraController.#maxCamera;
                }
            }
        });
    }

    static zoomOutToShowCollision() {
        CameraController.#game.camera.sx = 0.7;
        CameraController.#game.camera.sy = 0.7;
    }

}


export default CameraController