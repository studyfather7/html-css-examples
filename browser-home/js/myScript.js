let input = document.getElementsByTagName('input')[0];
// let itemWidth = document.getElementsByClassName('glass')[0].getElementsByTagName('li').length;
let itemNum = document.querySelectorAll('.dock li').length;
window.onload = () => {
    document.querySelector('.glass').style.setProperty('width', itemNum * 105 + 'px');
    input.focus();
}

document.querySelectorAll('.dock li').forEach(li => {

    li.addEventListener('click', e => {
        e.currentTarget.classList.add('loading');
    });
    
    li.addEventListener('mousemove', e => {
        let item = e.currentTarget;
        // item.querySelector('img').style.setProperty('border-radius', '0');
        // console.log("我是", item);
        let itemRect = item.getBoundingClientRect();
        let offset = Math.abs(e.clientX - itemRect.left) / itemRect.width;
        // console.log("坐标", offset);

        let prev = item.previousElementSibling || null
        let next = item.nextElementSibling || null;

        let scale = 0.6;


        // 
        resetScale();

        if (prev) {
            prev.style.setProperty('--scale', 1 + scale * Math.abs(offset - 1));
        }

        item.style.setProperty('--scale', 1 + scale);

        if (next) {
            next.style.setProperty('--scale', 1 + scale * offset);
        }

    });


});

document.querySelector('.dock').addEventListener('mouseleave', e => {
    resetScale();
});

function resetScale() {
    document.querySelectorAll('.dock li').forEach(li => {
        li.style.setProperty('--scale', 1);
    })
}