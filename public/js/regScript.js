const regForm = document.getElementById('reg-form');
const inputs = document.getElementsByTagName('input');

regForm.addEventListener('submit', async (event) => {
  event.preventDefault();

  const [username, nickname, password, confPass] = Array.from(inputs).map((el) => el.value);

  if (password === confPass) {
    const regFetch = await fetch('/reg', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username,
        nickname,
        password,
      }),
    });
    const status = await regFetch.json();

    if (status.duplicate) {
      let duplicateErr = document.getElementById('duplicateErr');

      if (!duplicateErr) {
        duplicateErr = document.createElement('div');
        duplicateErr.id = 'regErr';
        duplicateErr.innerText = 'This nickname is already taken!';
        regForm.appendChild(duplicateErr);
      } else {
        duplicateErr.remove();
      }
    } else if (status.success) {
      document.location = '/';
    } else if (status.anotherErr) {
      document.location = '/';
    }
  } else {
    let err = document.getElementById('regErr');

    if (!err) {
      err = document.createElement('div');
      err.id = 'regErr';
      err.innerText = 'Password mismatch!';
      regForm.appendChild(err);
    } else {
      err.remove();
    }
  }
});
