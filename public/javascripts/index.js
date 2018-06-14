$(window).load(function () {

    $(".li").on('click', function () {
        $(this).toggleClass('active').siblings().removeClass('active');
    });

    $(".menuBtn").on('click', function () {
        $(".chat-box").css({ "transform": "translate(50vw) scale(0.95)" });
        $(".message").css({ "transform": "translate(-50vw) scale(0.95)" });
        setTimeout(() => {
            $(".chat-box").css({ "z-index": "0" });
            setTimeout(() => {
                $(".chat-box").css({ "transform": "translate(0vw) scale(0.9)" });
                $(".message").css({ "transform": "translate(0vw) scale(1)" });
            }, 400);
        }, 100);
    });
    $(".closeBtn").on('click', function () {
        $(".chat-box").css({ "transform": "translate(50vw) scale(0.95)" });
        $(".message").css({ "transform": "translate(-50vw) scale(0.95)" });
        setTimeout(() => {
            $(".chat-box").css({ "z-index": "2" });
            setTimeout(() => {
                $(".chat-box").css({ "transform": "translate(0vw) scale(1)" });
                $(".message").css({ "transform": "translate(0vw) scale(0.9)" });
            }, 100);
        }, 400);
    });
});