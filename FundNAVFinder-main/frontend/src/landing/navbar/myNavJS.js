// import $ from "jquery";
// (function ($) { // Begin jQuery
//   $(function () { // DOM ready
//     // If a link has a dropdown, add sub menu toggle.
//     $('nav ul li a:not(:only-child)').click(function (e) {
//       $(this).siblings('.nav-dropdown').toggle();
//       // Close one dropdown when selecting another
//       $('.nav-dropdown').not($(this).siblings()).hide();
//       e.stopPropagation();
//     });
//     // Clicking away from dropdown will remove the dropdown class
//     $('html').click(function () {
//       $('.nav-dropdown').hide();
//     });
//     // Toggle open and close nav styles on click
//     $('#nav-toggle').click(function () {
//       $('nav ul').slideToggle();
//     });
//     // Hamburger to X toggle
//     $('#nav-toggle').on('click', function () {
//       this.classList.toggle('active');
//     });

//     window.onscroll = function () { myFunction() };

//     var header = document.getElementById("myHeader");
//     var sticky = header.offsetTop;

//     function myFunction() {
//       if (window.pageYOffset > sticky) {
//         header.classList.add("sticky");
//       } else {
//         header.classList.remove("sticky");
//       }
//     }


//   }); // end DOM ready
// })($); // end jQuery


