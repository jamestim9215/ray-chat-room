$(window).load(function () {

    $(".li").on('click', function () {
        $(this).toggleClass('active').siblings().removeClass('active');
    });

    $(".menuBtn").on('click', function () {
        $(".chat-box").css({ "z-index": "0", "transform": "rotateY(-180deg)" });
        $(".message").css({ "z-index": "2", "transform": "rotateY(0deg)" });
    });
    $(".closeBtn").on('click', function () {
        $(".chat-box").css({ "z-index": "2", "transform": "rotateY(0deg)" });
        $(".message").css({ "z-index": "0", "transform": "rotateY(180deg)" });
    });
});