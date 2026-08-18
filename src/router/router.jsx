import {createBrowserRouter, Navigate} from "react-router-dom";
import Layout from "../layouts/user/Layout.jsx";
import Main from "../pages/Main.jsx";
import AuthLayout from "../layouts/auth/AuthLayout.jsx";
import Login from "../pages/auth/Login.jsx";
import Terms from "../pages/auth/signup/Terms.jsx";
import Info from "../pages/auth/signup/Info.jsx";
import AdminRoute from "./AdminRoute.jsx";
import AdminLayout from "../layouts/admin/AdminLayout.jsx";
import AdminDashBoard from "../pages/admin/AdminDashBoard.jsx";
import AdminContentList from "../pages/admin/content/AdminContentList.jsx";
import AdminContentAdd from "../pages/admin/content/AdminContentAdd.jsx";
import AdminVideoAdd from "../pages/admin/content/AdminVideoAdd.jsx";
import AdminContentDetail from "../pages/admin/content/AdminContentDetail.jsx";
import AdminContentModify from "../pages/admin/content/AdminContentModify.jsx";
import AdminVideoModify from "../pages/admin/content/AdminVideoModify.jsx";
import SubscriptionManage from "../pages/subscription/SubscriptionManage.jsx";
import {CheckoutPage} from "../pages/payment/CheckoutPage.jsx";
import {SuccessPage} from "../pages/payment/SuccessPage.jsx";
import {FailPage} from "../pages/payment/FailPage.jsx";
import AdminUserList from "../pages/admin/user/AdminUserList.jsx";
import MovieList from "../pages/movie/MovieList.jsx";
import MovieDetail from "../pages/movie/MovieDetail.jsx";
import ReviewList from "../pages/review/ReviewList.jsx";
import ReviewDetail from "../pages/review/ReviewDetail.jsx";
import ReviewAdd from "../pages/review/ReviewAdd.jsx";
import ReviewModify from "../pages/review/ReviewModify.jsx";
import NewsList from "../pages/news/NewsList.jsx";
import EventList from "../pages/event/EventList.jsx";
import AdminEventList from "../pages/admin/event/AdminEventList.jsx";
import AdminEventAdd from "../pages/admin/event/AdminEventAdd.jsx";
import AdminEventDetail from "../pages/admin/event/AdminEventDetail.jsx";
import AdminEventModify from "../pages/admin/event/AdminEventModify.jsx";
import EventDetail from "../pages/event/EventDetail.jsx";
import AdminWinnerDetail from "../pages/admin/event/winnerList/AdminWinnerDetail.jsx";
import AdminWinnerAdd from "../pages/admin/event/winnerList/AdminWinnerAdd.jsx";
import AdminWinnerModify from "../pages/admin/event/winnerList/AdminWinnerModify.jsx";
import NotFound from "../pages/NotFound.jsx";
import WinnerDetail from "../pages/event/WinnerDetail.jsx";
import NoticeList from "../pages/notice/NoticeList.jsx";
import AdminNoticeList from "../pages/admin/notice/AdminNoticeList.jsx";
import NoticeDetail from "../pages/notice/NoticeDetail.jsx";
import AdminNoticeAdd from "../pages/admin/notice/AdminNoticeAdd.jsx";
import AdminNoticeModify from "../pages/admin/notice/AdminNoticeModify.jsx";
import AdminNoticeDetail from "../pages/admin/notice/AdminNoticeDetail.jsx";
import MyPage from "../pages/mypage/MyPage.jsx";
import MyPageModify from "../pages/mypage/MyPageModify.jsx";
import MyWishList from "../pages/mypage/MyWishList.jsx";
import MyReviewList from "../pages/mypage/MyReviewList.jsx";
import MyPagePasswordModify from "../pages/mypage/MyPagePasswordModify.jsx";

export const router = createBrowserRouter([
    {
        path: '/admin',
        element: <AdminRoute/>,
        children: [
            {
                element: <AdminLayout/>,
                children: [
                    {index: true, element: <Navigate to="dashboard" replace/>},
                    {path: 'dashboard', element: <AdminDashBoard/>},

                    // 콘텐츠
                    {path: 'content', element: <AdminContentList/>},
                    {path: 'content/:contentId', element: <AdminContentDetail/>},
                    {path: 'content/add', element: <AdminContentAdd/>},
                    {path: 'content/:contentId/modify', element: <AdminContentModify/>},
                    {path: 'content/:contentId/video/add', element: <AdminVideoAdd/>},
                    {path: 'content/:contentId/video/modify', element: <AdminVideoModify/>},

                    // 사용자
                    {path: 'user', element: <AdminUserList/>},

                    // 이벤트
                    {path: 'event', element: <AdminEventList/>},
                    {path: 'event/add', element: <AdminEventAdd/>},
                    {path: 'event/:eventId', element: <AdminEventDetail/>},
                    {path: 'event/:eventId/modify', element: <AdminEventModify/>},

                    // 이벤트 당첨자
                    {path: 'event/:eventId/winner', element: <AdminWinnerDetail/>},
                    {path: 'event/:eventId/winner/add', element: <AdminWinnerAdd/>},
                    {path: 'event/:eventId/winner/modify', element: <AdminWinnerModify/>},

                    // 공지사항
                    {path: 'notice', element: <AdminNoticeList/>},
                    {path: 'notice/add', element: <AdminNoticeAdd/>},
                    {path: 'notice/modify/:noticeId', element: <AdminNoticeModify/>},
                    {path: 'notice/:noticeId', element: <AdminNoticeDetail/>},

                    // 404
                    {path: '*', element: <NotFound/>},
                ]
            }
        ]
    },
    {
        element: <AuthLayout/>,
        children: [
            {path: '/auth/login', element: <Login/>},
            {path: '/auth/signup/terms', element: <Terms/>},
            {path: '/auth/signup/info', element: <Info/>}
        ]
    },
    {
        element: <Layout/>,
        children: [
            // 메인 페이지
            {path: '/', element: <Main/>},

            // 영화 페이지
            {path: '/movie', element: <MovieList/>},
            {path: '/movie/:contentId', element: <MovieDetail/>},

            // 리뷰 페이지
            {path: '/review', element: <ReviewList/>},
            {path: '/review/:contentReviewId', element: <ReviewDetail/>},
            {path: '/review/add', element: <ReviewAdd/>},
            {path: '/review/modify/:contentReviewId', element: <ReviewModify/>},

            // 뉴스 페이지
            {path: '/news', element: <NewsList/>},

            // 이벤트
            {path: '/event', element: <EventList/>},
            {path: '/event/:eventId', element: <EventDetail/>},
            {path: '/event/:eventId/winner', element: <WinnerDetail/>},

            // 공지사항
            {path: '/notice', element: <NoticeList/>},
            {path: '/notice/:noticeId', element: <NoticeDetail/>},

            // 구독 페이지
            {path: '/subscription', element: <SubscriptionManage/>},

            // 마이 페이지
            {path: '/mypage', element: <MyPage/>},
            {path: '/mypage/modify', element: <MyPageModify/>},
            {path: '/mypage/modify/password', element: <MyPagePasswordModify/>},
            {path: '/mypage/wishlist', element: <MyWishList/>},
            {path: '/mypage/reviewlist', element: <MyReviewList/>},

            // 404
            {path: "*", element: <NotFound/>},

        ]
    },
    // 결제 페이지
    {path: '/payment/checkout/:orderId', element: <CheckoutPage/>},
    {path: '/payment/success', element: <SuccessPage/>},
    {path: '/payment/fail', element: <FailPage/>},
])