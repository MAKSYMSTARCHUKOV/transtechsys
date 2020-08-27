export default {
  middleware({ app, store, route, redirect }) {
    let red = false;
    let matched = false;
    const name = route.name.substring(route.name.indexOf('-') + 1);
    const links = store.state.roleMenu.filter((a) => {
      if (a.sub) {
        return a.sub.filter((b) => b.path === name).length > 0;
      } else {
        return a.path === name;
      }
    });
    const role = app.$localstorage.get('plan');

    for (const l of links) {
      if (l.sub) {
        const match = l.sub.filter((a) => {
          if (a.path === name) {
            if (a.for) {
              if (!a.for.includes(role)) {
                return true;
              }
            }
          }
          return false;
        });
        const hasSub = l.sub.filter((a) => {
          if (a.path === name) {
            if (a.for) {
              if (a.for.includes(role)) {
                return true;
              }
            }
          }
          return false;
        });
        if (!app.$isEmpty(match)) {
          red = true;
        }
        if (!app.$isEmpty(hasSub)) {
          matched = true;
        }
        break;
      }
    }

    if (!matched) {
      for (const l of links) {
        if (!l.sub) {
          if (l.path === name) {
            if (l.for) {
              if (!l.for.includes(role)) {
                red = true;
                break;
              }
            }
          }
        }
      }
    }

    if (red) {
      redirect({ name: 'cabinet-profile' });
    }
  }
};
