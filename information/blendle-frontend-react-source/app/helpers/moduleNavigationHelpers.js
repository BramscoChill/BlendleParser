import React from 'react';
import NavNodeItem from 'components/moduleNavigation/NavNodeItem';
import NavDropDownItem from 'components/moduleNavigation/NavDropDownItem';
import NavPopoutItem from 'components/moduleNavigation/NavPopoutItem';
import NavLinkItem from 'components/moduleNavigation/NavLinkItem';

function isActive(activeUrl, itemUrl, aliases = []) {
  return [itemUrl, ...aliases].includes(activeUrl);
}

function renderItemForUrl(activeUrl) {
  return (item, i) => {
    const isActiveItem = isActive(activeUrl, item.url, item.aliases);

    if (React.isValidElement(item)) {
      return React.cloneElement(item, {
        key: i,
        isActive: isActiveItem,
      });
    }
    if (item.getElement) {
      return <NavNodeItem key={i} getNode={item.getElement} isActive={isActiveItem} />;
    }
    if (item.popoutItem) {
      return (
        <NavPopoutItem
          key={i}
          item={item}
          renderChildren={renderItemForUrl(activeUrl)}
          isActive={isActiveItem}
        />
      );
    }
    if (item.children) {
      return <NavDropDownItem key={i} item={item} renderChildren={renderItemForUrl(activeUrl)} />;
    }

    return <NavLinkItem key={i} item={item} isActive={isActiveItem} />;
  };
}

export function getComponents(navItems, activeUrl) {
  const renderItem = renderItemForUrl(activeUrl);

  return navItems.map(renderItem);
}



// WEBPACK FOOTER //
// ./src/js/app/helpers/moduleNavigationHelpers.js