export const MOCK_BOOKS = [
    { id: '1', title: 'Kimetsu no Yaiba', author: 'Koyoharu Gotouge', totalVolumes: 23, ownedVolumes: 23, status: 'complete', color: '#dc2626', hasGoods: true, goodsCount: 5, coverUrl: 'https://cdn.myanimelist.net/images/manga/3/179023l.jpg' },
    { id: '2', title: 'Spy x Family', author: 'Tatsuya Endo', totalVolumes: 13, ownedVolumes: 10, status: 'ongoing', color: '#2563eb', hasGoods: false, goodsCount: 0, coverUrl: 'https://cdn.myanimelist.net/images/manga/3/258224l.jpg' },
    { id: '3', title: 'Jujutsu Kaisen', author: 'Gege Akutami', totalVolumes: 26, ownedVolumes: 26, status: 'complete', color: '#7c3aed', hasGoods: true, goodsCount: 3, coverUrl: 'https://cdn.myanimelist.net/images/manga/3/216464l.jpg' },
    { id: '4', title: 'Vinland Saga', author: 'Makoto Yukimura', totalVolumes: 27, ownedVolumes: 20, status: 'ongoing', color: '#92400e', hasGoods: false, goodsCount: 0 },
    { id: '5', title: 'Berserk', author: 'Kentaro Miura', totalVolumes: 41, ownedVolumes: 41, status: 'dropped', color: '#475569', hasGoods: false, goodsCount: 0 },
    { id: '6', title: 'One Piece', author: 'Eiichiro Oda', totalVolumes: 108, ownedVolumes: 50, status: 'ongoing', color: '#ea580c', hasGoods: true, goodsCount: 2 },
    { id: '7', title: 'Chainsaw Man', author: 'Tatsuki Fujimoto', totalVolumes: 16, ownedVolumes: 16, status: 'ongoing', color: '#ca8a04', hasGoods: true, goodsCount: 1 },
    { id: '8', title: 'Blue Period', author: 'Tsubasa Yamaguchi', totalVolumes: 14, ownedVolumes: 14, status: 'complete', color: '#0d9488', hasGoods: false, goodsCount: 0 },
];
export const MOCK_VOLUMES = [
    // Kimetsu no Yaiba (id: 1)
    { id: 'v1', bookId: '1', volumeNumber: 1, coverUrl: 'https://cdn.myanimelist.net/images/manga/3/179023l.jpg', purchaseDate: '2020-01-15', price: 35000 },
    { id: 'v2', bookId: '1', volumeNumber: 2, coverUrl: '', purchaseDate: '2020-02-10', price: 35000 },
    { id: 'v3', bookId: '1', volumeNumber: 3, coverUrl: '', purchaseDate: '2020-03-05', price: 35000 },
    { id: 'v4', bookId: '1', volumeNumber: 4, coverUrl: '', purchaseDate: '2020-04-01', price: 35000 },
    { id: 'v5', bookId: '1', volumeNumber: 5, coverUrl: '', purchaseDate: '2020-05-20', price: 35000 },
    // Spy x Family (id: 2)
    { id: 'v10', bookId: '2', volumeNumber: 1, coverUrl: 'https://cdn.myanimelist.net/images/manga/3/258224l.jpg', purchaseDate: '2021-03-10', price: 38000 },
    { id: 'v11', bookId: '2', volumeNumber: 2, coverUrl: '', purchaseDate: '2021-04-15', price: 38000 },
    { id: 'v12', bookId: '2', volumeNumber: 3, coverUrl: '', purchaseDate: '2021-05-20', price: 38000 },
];
export const MOCK_GOODS = [
    { id: 'g1', bookId: '1', name: 'Standee Tanjiro', type: 'standee', imageUrl: '', purchaseDate: '2021-06-20', price: 120000 },
    { id: 'g2', bookId: '1', name: 'Artbook vol.1', type: 'artbook', imageUrl: '', purchaseDate: '2021-08-15', price: 250000 },
];
