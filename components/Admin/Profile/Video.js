import React, {useEffect, useState} from 'react';
import {Button, message, Upload, Form} from 'antd';
import {useRouter} from "next/router";
import {useDispatch, useSelector} from "react-redux";
import Link from 'next/link';
import {CloudDownloadOutlined} from '@ant-design/icons';

import VideoPlayer from '../../UI/VideoPlayer';
import Loader from '../../UI/Loader';
import routes from "../../../constants/routes";

const {Item} = Form;


const Video = props => {
    const dispatch = useDispatch();
    const loading = useSelector(state => state.loading.effects.adminProfile.addCategory);
    const token = useSelector(state => state?.adminAuth?.token);
    const router = useRouter();
    const [leftVideoUrl, setLeftVideoUrl] = useState("");
    const [rightVideoUrl, setRightVideoUrl] = useState('');
    const [leftVideoUploading, setLeftVideoUploading] = useState(false);
    const [rightVideoUploading, setRightVideoUploading] = useState(false);
    const [prevVideosUploading, setPrevVideosUploading] = useState(false);
    const [videos, setVideos] = useState([]);

    useEffect(async () => {
        if (token) {
            try {
                setPrevVideosUploading(true);
                const res = await dispatch?.adminProfile?.getVideos({token});
                setVideos(res?.data);
                setPrevVideosUploading(false);
            } catch(err) {
                setPrevVideosUploading(false);
            }
        }
    }, [token]);

    useEffect(() => {
        if (videos?.length > 0) setLeftVideoUrl(videos[0]?.url);
        if (videos?.length > 1) setRightVideoUrl(videos[1]?.url);
    }, [videos]);

    const submitHandler = async () => {

        const leftVideoBody = {
            url: leftVideoUrl,
            arrangementNum: 1
        };
        const rightVideoBody = {
            url: leftVideoUrl,
            arrangementNum: 2
        };

        const res1 = await dispatch.adminProfile.addVideo({body: leftVideoBody, token});
        const res2 = await dispatch.adminProfile.addVideo({body: rightVideoBody, token});
        if (res1 && res2) {
            message.success('New Videos added successfully!', 5);
            router.push({pathname: routes.admin.profile.index, query: {tab: 'video'}});
        }
    };

    function beforeUpload(file) {
        const isValidVideo = file.type.includes('bmp') || file.type.includes('mp4') || file.type.includes('mkv');
        if (!isValidVideo) {
            message.error('Please upload video with format bmp/mp4/mkv');
        }
        const isLt30M = file.size / 1024 / 1024 < 30;
        if (!isLt30M) {
            message.error('Video must be smaller than 30MB!');
        }
        return isValidVideo && isLt30M;
    }

    const handleLeftVideoUpload = info => {
        if (info.file.status === 'uploading') {
            setLeftVideoUploading(true);
            return;
        }
        if (info.file.status === 'error') {
            setLeftVideoUploading(false);
            message.error('Please try again');
            return;
        }
        if (info.file.status === 'done') {
            setLeftVideoUploading(false);
            setLeftVideoUrl(`${process.env.NEXT_PUBLIC_API_BASE_URL}v1/files/photos${info.file.response.data.path}`);
        }
    };

    const handleRightVideoUpload = info => {
        if (info.file.status === 'uploading') {
            setRightVideoUploading(true);
            return;
        }
        if (info.file.status === 'error') {
            setRightVideoUploading(false);
            message.error('Please try again');
            return;
        }
        if (info.file.status === 'done') {
            setRightVideoUploading(false);
            setRightVideoUrl(`${process.env.NEXT_PUBLIC_API_BASE_URL}v1/files/photos${info.file.response.data.path}`);
        }
    };

    const uploadProps = {
        action: '/v1/files/photos/',
        headers: {
            Authorization: `Bearer ${token}`
        },

        progress: {
            strokeColor: {
                '0%': '#ff4b45',
                '100%': '#87d068',
            },
            strokeWidth: 2,
            format: percent => `${parseFloat(percent.toFixed(2))}%`,
        },
    };

    const UploadVideo = ({onUpload, type}) => (<Upload
        name="photo"
        listType="picture-card"
        className="avatar-video-uploader-wrapper border-0"
        showUploadList={false}
        beforeUpload={beforeUpload}
        onChange={onUpload}
        {...uploadProps}
    >
        <Button
            className={'text-overline bg-card flex items-center justify-center hover:text-button'}
            loading={(type === 'left' && leftVideoUploading) || (type === 'right' && rightVideoUploading)}
        >
            <CloudDownloadOutlined style={{fontSize: 30}}/>
            <span>Upload Video</span>
        </Button>
    </Upload>);

    return (
        <div className="py-5 flex flex-col">
            <div className="flex flex-col">
                <div className="font-bold">Upload Your Videos</div>
                <div className="grid grid-cols-2 items-start gap-x-2 mt-3">
                    <div className="flex flex-col">
                        <div className="w-full" style={{minHeight: videos?.length > 0 ? 250 : 10}}>
                            {prevVideosUploading ? <div className="flex justify-center items-center"><Loader/></div> : videos?.length > 0 && <VideoPlayer src={leftVideoUrl}/>}
                        </div>
                        <UploadVideo type="left" onUpload={handleLeftVideoUpload}/></div>
                    <div className="flex flex-col">
                        <div className="w-full" style={{minHeight: videos?.length > 0 ? 250 : 10}}>
                            {prevVideosUploading ? <div className="flex justify-center"><Loader/></div> : videos?.length > 1 && <VideoPlayer src={rightVideoUrl}/>}
                        </div>
                        <UploadVideo type="right" onUpload={handleRightVideoUpload}/>
                    </div>
                </div>
            </div>
            <div className="flex justify-end space-x-2 mt-8"
                //style={{position: 'relative', top: 450, left: 640}}
            >
                <Button
                    type="primary"
                    block
                    className='w-full md:w-32 ml-0 md:ml-5'
                    htmlType='submit'
                    loading={loading}
                    onClick={submitHandler}
                >
                    Save
                </Button>
                <Link
                    href={{pathname: routes.admin.profile.index, query: {tab: 'video'}}}
                >
                    <Button danger className='w-full md:w-32'>Cancel</Button>
                </Link>
            </div>
        </div>
    )
};

export default Video;