$(document).ready(function () {
    const $entry = $('#entry');
    const $form = $('#form');
    const $ul = $('#todo-list');
    const $alertP = $('.alert');

    const $clearBtn = $('.clear-btn');
    const $submitBtn = $('.submit-btn');
    const $cancelBtn = $('.cancel-btn');

    $form.on('submit', addItem);
    $clearBtn.on('click', clearItems);
    $cancelBtn.on('click', setBackToDefault);

    let editFlag = false;
    let editElement;
    let LSkey = 'items';
    let editID;

    $(window).on('DOMContentLoaded', setupItems);

    setupItems();

    function addItem(e) {
      e.preventDefault();
      let val = $entry.val();
      let id = new Date().getTime().toString();

      if (val && !editFlag) {
        createLIS(val, id);
        displayAlert('A new item has been added!', 'alert-success');
        $clearBtn.removeClass('d-none');
        addToLS(val, id);
      } else if (val && editFlag) {
        editElement.text(val);
        displayAlert('Successfully edited', 'alert-success');
        editLS(val, editID);
        setBackToDefault();
      } else {
        displayAlert('You have not entered anything!', 'alert-danger');
      }

      $entry.val('');
    }

    function createLIS(val, id) {
      const $li = $('<li></li>').addClass('list-item').attr('data-id', id).html(`
        <p class="text">${val}</p>
        <i class="bi bi-pencil-square"></i>
        <i class="bi bi-check-lg"></i>
        <i class="bi bi-trash"></i>`);

      $li.find('.bi.bi-pencil-square').on('click', editItem);
      $li.find('.bi.bi-check-lg').on('click', checkItem);
      $li.find('.bi.bi-trash').on('click', deleteItem);

      $ul.append($li);
    }

    function editItem() {
      editFlag = true;
      editID = $(this).parent().attr('data-id');
      let pText = $(this).prev();
      editElement = pText;
      $entry.val(pText.text());
      $submitBtn.text('Edit');
      $cancelBtn.removeClass('d-none');
      $ul.find('.bi').addClass('v-none');
      $clearBtn.addClass('d-none');
    }

    function checkItem() {
      $(this).parent().toggleClass('liChecked');
    }

    function deleteItem() {
      let id = $(this).parent().attr('data-id');
      $(this).parent().remove();
      displayAlert('You remove one item!', 'alert-danger');
      if ($ul.children().length === 0) {
        $clearBtn.addClass('d-none');
      }
      removeFromLS(id);
    }

    function displayAlert(mesg, styles) {
      $alertP.text(mesg).addClass(styles);
      setTimeout(() => {
        $alertP.text('').removeClass(styles);
      }, 1500);
    }

    function clearItems() {
      $ul.empty();
      displayAlert('All items were removed!', 'alert-danger');
      $clearBtn.addClass('d-none');
      localStorage.clear();
    }

    function setBackToDefault() {
      editFlag = false;
      editElement = undefined;
      editID = undefined;
      $entry.val('');
      $submitBtn.text('Submit');
      $cancelBtn.addClass('d-none');
      $ul.find('.bi').removeClass('v-none');
      $clearBtn.removeClass('d-none');
    }

    function addToLS(val, id) {
      let obj = { id, val };
      let items = getLS();
      items.push(obj);
      localStorage.setItem(LSkey, JSON.stringify(items));
    }

    function getLS() {
      return localStorage.getItem(LSkey) ? JSON.parse(localStorage.getItem(LSkey)) : [];
    }

    function removeFromLS(id) {
      let items = getLS();
      items = items.filter(item => item.id !== id);
      localStorage.setItem(LSkey, JSON.stringify(items));
      if (items.length === 0) {
        localStorage.removeItem(LSkey);
      }
    }

    function editLS(val, editID) {
      let items = getLS();
      items = items.map(item => {
        if (item.id === editID) {
          item.val = val;
        }
        return item;
      });
      localStorage.setItem(LSkey, JSON.stringify(items));
    }

    function setupItems() {
      let items = getLS();
      if (items.length > 0) {
        items.forEach(item => {
          const { id, val } = item;
          createLIS(val, id);
        });
        $clearBtn.removeClass('d-none');
      }
    }
  });